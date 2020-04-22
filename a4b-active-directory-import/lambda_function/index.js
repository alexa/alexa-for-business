var uuidv4 = require('uuid/v4');
var AuthenticationContext = require('adal-node').AuthenticationContext;
var adal = require('adal-node');
var MicrosoftGraph = require("@microsoft/microsoft-graph-client");
require('es6-promise').polyfill();
require('isomorphic-fetch');
var AWS = require("aws-sdk");
var A4B = new AWS.AlexaForBusiness({region: 'us-east-1'});
var SSM = new AWS.SecretsManager({region: 'us-east-1'});

// Default global variables
var RESOURCE = "https://graph.microsoft.com/";
var USE_GROUPNAME_FOR_ADDRESSBOOK = 1;
var DEFAULT_ADDRESS_BOOK = 'Default';
var CREATE_ADDRESSBOOK = 1;
var FILTER_STRING = null;
var DEBUG = 0;
var FOUNDADDRESSBOOKS = [];
var ACCESSTOKEN='';
var SECRETSNAME='';
var TENANT='';
var CLIENTID='';
var CLIENTSECRET='';
var AUTHORITYHOSTURL = 'https://login.microsoftonline.com';
var CREATE_ADDRESSBOOK_FIELD = 'displayName';
var DEFAULT_CONTACTS_PER_ADDRESSBOOK = 100;
var USE_GROUPS = 1;

//Turn on logging for adal Lib
function turnOnLoggingForAdal() {
    var log = adal.Logging;
    log.setLoggingOptions(
    {
      level : log.LOGGING_LEVEL.VERBOSE,
      log : function(level, message, error) {
        console.debug(message);
        if (error) {
          console.error(error);
        }
      }
    });
}

//Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Check if value has a key 
function hasKey(value, key){
    return value.hasOwnProperty(key);
}

//Check if key has a value
function hasValue(value, key) {
    return value[key] != null;
}

//Check is array of dictionary has key
function arrayHasKey(ar, key){
    let exists = false;
    ar.forEach(obj => {
        if (obj.Group == key){
            exists = true;
        }
    });

    return exists;
}

//Add value to array inside of dictionary
function addArrayValue(ar, key, value){
    ar.forEach(obj => {
        if (obj.Group == key){
            obj.Users.result.value.push(value);
        }
    });

    return ar;
}

//If using SSM get oAuth2 information
async function getSecrets(secretName) {
    return await SSM.getSecretValue({SecretId: secretName}).promise().then((data) => {
        if ('SecretString' in data) {
            return {'ok': true, 'result': JSON.parse(data.SecretString)};
        } else {
            let buff = new Buffer(data.SecretBinary, 'base64');
            return {'ok': true, 'result': JSON.parse(buff.toString('ascii'))};
        }
    })
    .catch(
        function(err) {
            return {'ok': false, 'error': err};
        }
    );
}

//Get Access Token for AD
function getAccessToken(url, tenant, resource, appId, secret) {
    return new Promise((resolve) => {
        try {
            let authorityUrl = url + '/' + tenant;
            const context = new AuthenticationContext(authorityUrl);
            context.acquireTokenWithClientCredentials(
                resource,
                appId,
                secret,
                function(err, tokenResponse) {
                    if (err) {
                        resolve({'ok': false, 'error': err});
                    } else {
                        resolve({'ok': true, 'result': tokenResponse});
                    }
                }
            );
        } catch (error) {
            resolve({'ok': false, 'error': error});
        }
    });
}

//Create Graph Client to AD
function getClient(token) {
    return MicrosoftGraph.Client.init({
        defaultVersion: 'v1.0',
        authProvider: (done) => {
            done(null, token.accessToken);
        }
    });
}

// Find existing AddressBooks we already searched for
function getFoundAddressBook(name){
    let result;
    FOUNDADDRESSBOOKS.forEach(element => {
        if (element.name == name){
            result = element.data;
        }
    });

    return result;
}

// Get Active Directory users
function search_active_directory_users(client, filter=null){
    return new Promise((resolve) => {
        try {
            if (filter) {
                client
                    .api('/users')
                    .filter(filter)
                    .get((err, result) => {
                        if (err) {
                            resolve ({'ok':false, 'error': err});
                        } else {
                            resolve ({'ok':true, 'result': result});
                        }
                });
            } else {
                client
                    .api('/users')
                    .get((err, result) => {
                        if (err) {
                            resolve ({'ok':false, 'error': err});
                        } else {
                            resolve ({'ok':true, 'result': result});
                        }
                });
            }
        } catch (error) {
            resolve({'ok': false, 'error': error});
        }
    });
}

//Get Active Directory user groups
function search_active_directory_usergroup(client, user) {
    return new Promise((resolve) => {
        try {
            client
                .api('/users/'+user.id+'/memberOf')
                .get((err, result) => {
                    if (err) {
                        resolve({'ok': false, 'error':err});
                    } else {
                        resolve({'ok': true, 'result': result});
                    }
                });
        } catch (error) {
            resolve({'ok': false, 'error': error});
        }
    });
}

//Get the first AD User Group
function getUserGroup(groups, groupType='#microsoft.graph.group') {
    let group = groups.result.value;
    let name;
    group.forEach(groupEntry => {
        if (groupEntry['@odata.type'] == groupType){
            name = groupEntry.displayName;
        }
    });

    return name;
}

//Get all groups in AD
function getGroups(client, filter) {
    return new Promise((resolve) => {
        try {
            client
                .api('/groups')
                .filter(filter)
                .get((err, result) => {
                    if (err){
                        resolve({'ok': false, 'error': err});
                    } else {
                        resolve({'ok': true, 'result': result});
                    }
                });
        } catch (error) {
            resolve({'ok': false, 'error': error});
        }
    });
}

//Get user list from group
function getGroupMembers(client, groupId) {
    groupMembers = [];
    return new Promise((resolve) => {
        try {
            client
                .api('/groups/'+groupId+'/members')
                .get((err, result) => {
                    if (err){
                        resolve({'ok': false, 'error': err});
                    } else {
                        resolve({'ok': true, 'result': result});
                    }
                });
        } catch (error) {
            resolve({'ok': false, 'error': error});
        }
    });
}

// Search to see if contact already exists in A4B
function search_contacts(name) {
    var params = {
        Filters: [
            {
                'Key': 'DisplayName',
                'Values': [
                    name
                ],
            }
        ]
    };

    return new Promise((resolve) => {
        try {
            A4B.searchContacts(params).promise().then(data => {
                if (DEBUG==1){
                    console.debug('(search_contacts): ', JSON.stringify(data));
                }
                if ((!data.Contacts) || (data.Contacts.length == 0)){
                    resolve({'ok': true, 'contacts': data});
                } else {
                    resolve({'ok': true, 'contacts': data});
                }
            });
        } catch (error) {
            resolve({'ok': false, 'error': error});
        }
    });
}

// Update an existing A4B contact
async function update_contact(contact, user){
    let params = {
        ContactArn: contact.ContactArn,
        DisplayName: user.displayName,
        FirstName: user.givenName,
        LastName: user.sn ? user.sn : user.surname
    };

    if (!hasValue(params, 'FirstName')) {
        return {'ok': false, 'error': 'Missing the following field: FirstName for contact: ' + user.displayName};
    }

    params = update_phoneNumbers(user, params);

    if (!hasKey(params,'PhoneNumber') && !hasKey(params, 'SipAddresses') && !hasKey(params, 'PhoneNumbers'))
    {
        return {'ok': false, 'error': 'No PhoneNumber or SipAddress defined, you must have at least one for contact: ' + user.displayName};
    } else {
        return await A4B.updateContact(params).promise().then(data => {
            if (DEBUG==1){
                console.debug('(update_contact): ', JSON.stringify(data));
            }
            if (data) {
                return {'ok': true, 'contact_results': data};
            } else {
                return {'ok': false, 'contact_results': data};
            }
        })
        .catch(
            function(err) {
                return {'ok': false, 'error': err};
            }
        );
    }
}

//Update PhoneNumbers
function update_phoneNumbers(user, params){
    //Check how many numbers we have defined
    let phoneNumbers = [];
    let workNumberSet = false;
    let workNumber;

    if (user.telephoneNumber){
        let workPhone = {
            Number: user.telephoneNumber,
            Type: 'WORK'
        };
        phoneNumbers.push(workPhone);
        workNumber = user.telephoneNumber;
        workNumberSet = true;
    }

    if (user.mobilePhone) {
        let mobilePhone = {
            Number: user.mobilePhone,
            Type: 'MOBILE'
        };
        phoneNumbers.push(mobilePhone);
    }

    if (user.mobile){
        let mobilePhone = {
            Number: user.mobile,
            Type: 'MOBILE'
        };
        phoneNumbers.push(mobilePhone);
    }

    if ((user.businessPhones) && (user.businessPhones.length > 0)) {
        user.businessPhones.forEach(businessPhoneNumber => {
            let workPhone = {
                Number: businessPhoneNumber,
                Type: 'WORK'
            };
            phoneNumbers.push(workPhone);
        });
        workNumber = user.businessPhones[0];
        workNumberSet = true;
    }

    if (phoneNumbers.length > 1) {
        params.PhoneNumbers = phoneNumbers;
    } else if ((phoneNumbers.length == 1) && (workNumberSet)) {
        params.PhoneNumber = workNumber;
    }


    if (user.ipPhone){
        let sipNumbers = [{
            Uri: user.ipPhone,
            Type: 'WORK'
        }];
        params.SipAddresses = sipNumbers;
    }

    return params;
}

// Create a new A4B contact
async function create_contact(user){
    let params = {
        DisplayName: user.displayName,
        FirstName: user.givenName,
        LastName: user.sn ? user.sn : user.surname,
        ClientRequestToken: uuidv4()
    };

    if (!hasValue(params, 'FirstName')) {
        return {'ok': false, 'error': 'Missing the following field: FirstName for contact: ' + user.displayName};
    }

    params = update_phoneNumbers(user, params);

    if (!hasKey(params,'PhoneNumber') && !hasKey(params, 'SipAddresses') && !hasKey(params, 'PhoneNumbers'))
    {
        return {'ok': false, 'error': 'No PhoneNumber or SipAddress defined, you must have at least one for contact: ' + user.displayName};
    } else {
        return await A4B.createContact(params).promise().then(function(data) {
            if (DEBUG==1){
                console.debug('(create_contact): ', JSON.stringify(data));
            }
            if (!data) {
                return {'ok': false, 'contact_results': data};
            } else {
                return {'ok': true, 'contact_results': data};
            }
        })
        .catch(
            function(err) {
                console.error('ERROR: (createContact): ' + err, params);
                if(DEBUG==1){
                    console.debug('ERROR: (createContact): ', err.stack);
                }
                return {'ok': false, 'error': err};
            }
        );
    }
}

// Search to find existing Address Book in A4B
async function search_address_books(name){
    let cached_data = getFoundAddressBook(name);

    if (cached_data){
        return {'ok': true, 'address_books': cached_data};
    } else {
        let params = {
            Filters: [
                {
                    'Key': 'AddressBookName',
                    'Values': [
                        name
                    ],
                }
            ]
        };

        return await A4B.searchAddressBooks(params).promise().then(function(data) {
            if (DEBUG==1){
                console.debug('(search_address_books): ', JSON.stringify(data));
            }
            if ((!data.AddressBooks) || (data.AddressBooks.length == 0)){
                return {'ok': true, 'address_books': data};
            } else {
                FOUNDADDRESSBOOKS.push({'name': name, 'data': data});
                return {'ok': true, 'address_books': data};
            }
        })
        .catch(
            function(err) {
                return {'ok': false, 'error': err};
            }
        );
    }
}

// Create a new Address Book in A4B
async function create_address_book(name) {
    let random_uuid = uuidv4();
    let params = {
        Name: name,
        Description: name,
        ClientRequestToken: random_uuid
    };

    return await A4B.createAddressBook(params).promise().then(function(data) {
        if (DEBUG==1){
            console.debug('(create_address_book): ', JSON.stringify(data));
        }
        if (data){
            return {'ok': true, 'address_book_arn': data};
        } else {
            console.debug('(createAddressBook): No AddressBooks found');
            return {'ok': false, 'address_book_arn': data};
        }
    })
    .catch(
        function(err) {
            return {'ok': false, 'error': err};
        }
    );
}

// Associate contact to Address Book in A4B
async function associate_contact_with_address_book(contactArn, addressBookArn){
    let params = {
        AddressBookArn: addressBookArn,
        ContactArn: contactArn
    };

    return await A4B.associateContactWithAddressBook(params).promise().then(function(data) {
        if (DEBUG==1){
            console.debug('(associate_contact_with_address_book): ', JSON.stringify(data));
        }
        if (data){
            return {'ok': true, 'associate_address_book': 'associated'};
        } else {
            return {'ok': false, 'associate_address_book': 'not associated'};
        }
    })
    .catch(
        function(err) {
            return {'ok': false, 'error': err};
        }
    );
}

// Set all environment options as well as configure AD connector
async function getandsetEnvironmentVariables() {

    if ('secretsname' in process.env){
        SECRETSNAME = process.env.secretsname;
    }

    
    if ('tenant' in process.env){
        TENANT = process.env.tenant;
    }

    if (SECRETSNAME){
        CLIENTID = await getSecrets(SECRETSNAME).then(result => {
            if (result.ok == true){
                return result.result.applicationId;
            } else {
                console.error('Failed to access the key "applicationid" from the Secrets Manager: ', result.error);
                return null;
            }
        });
    } else {
        if ('applicationId' in process.env){
            CLIENTID = process.env.applicationId;
        } else {
            console.error('Failed to find ENV key "applicationId", this is required to access your Active Directory resource.');
        }
    }

    if (SECRETSNAME){
        CLIENTSECRET = await getSecrets(SECRETSNAME).then(result => {
            if (result.ok == true){
                return result.result.clientSecret;
            } else {
                console.error('Failed to access the key "clientSecret" from the Secrets Manager: ', result.error);
                return null;
            }
        });
    } else {
        if ('clientSecret' in process.env){
            CLIENTSECRET = process.env.clientSecret;
        } else {
            console.error('Failed to find ENV key "clientSecret", this is required to access your Active Directory resource.');
        }
    }

    if ('authorityHostUrl' in process.env){
        AUTHORITYHOSTURL = process.env.authorityHostUrl;
    }

    if ('create_address_book' in process.env){
        CREATE_ADDRESSBOOK = process.env.create_address_book;
    }

    if ('create_address_book_by_field' in process.env){
        CREATE_ADDRESSBOOK_FIELD = process.env.create_address_book_by_field;
    }

    if ('use_groupname_for_addressbook' in process.env){
        USE_GROUPNAME_FOR_ADDRESSBOOK = process.env.use_groupname_for_addressbook;
    }

    if ('use_groups' in process.env){
        USE_GROUPS = process.env.use_groups;
    }
    
    if ('addressbook_contact_total' in process.env){
        DEFAULT_CONTACTS_PER_ADDRESSBOOK = process.env.addressbook_contact_total;
    }

    if ('default_addressbook_name' in process.env){
        DEFAULT_ADDRESS_BOOK = process.env.default_addressbook_name;
    }

    if ('debug' in process.env){
        DEBUG = process.env.debug;
    }

    if ('filter_string' in process.env){
        FILTER_STRING = process.env.filter_string;
    }

    if (DEBUG==1){
        console.debug('debug; ', DEBUG);
        console.debug('create_address_book: ', CREATE_ADDRESSBOOK);
        console.debug('create_address_book_field: ', CREATE_ADDRESSBOOK_FIELD);
        console.debug('use_groupname_for_addressbook: ', USE_GROUPNAME_FOR_ADDRESSBOOK);
        console.debug('addressbook_contact_total: ', DEFAULT_CONTACTS_PER_ADDRESSBOOK);
        console.debug('authorityHostUrl: ', AUTHORITYHOSTURL);
        console.debug('tenant: ', TENANT);
        console.debug('default_address_book: ', DEFAULT_ADDRESS_BOOK);
        console.debug('filter_string: ', FILTER_STRING);
        turnOnLoggingForAdal();
    }
}


exports.handler = async (event) => {
    // Configure out environment
    await getandsetEnvironmentVariables();
    //Get accesstoken 
    ACCESSTOKEN= await getAccessToken(AUTHORITYHOSTURL, TENANT, RESOURCE, CLIENTID, CLIENTSECRET).then(result => {return result;});
    if (ACCESSTOKEN.ok == true) {        
        let CLIENT = await getClient(ACCESSTOKEN.result);
        let USERS;
        var USERGROUPS = [];
        if (USE_GROUPS){
            let groups = await getGroups(CLIENT, FILTER_STRING);
            await Promise.all(groups.result.value.map(async (group) => {
                let users = await getGroupMembers(CLIENT, group.id).then(result => {return result;});
                let g_name = group.displayName;
                USERGROUPS.push({Group: g_name,  Users: users});
            }));
        } else {
            USERS = await search_active_directory_users(CLIENT, FILTER_STRING).then(result => {return result;});
            await Promise.all(USERS.result.value.map(async (user) => {
                let groups = await search_active_directory_usergroup(CLIENT, user).then(result => {return result;});
                let g_name = getUserGroup(groups);
                if (arrayHasKey(USERGROUPS, g_name)) {
                    USERGROUPS = addArrayValue(USERGROUPS, g_name, user);
                } else {
                    let t_users = [user];
                    let ret = {ok: true, result: {value: t_users}};
                    USERGROUPS.push({Group: g_name, Users: ret});
                }
            }));
        }
        var uindex = 0;
        var gindex = 0;
        var delay = 1000;
        while(gindex < USERGROUPS.length) {
            if (uindex < USERGROUPS[gindex].Users.result.value.length){
                let user = USERGROUPS[gindex].Users.result.value[uindex];
                let contacts = await search_contacts(user.displayName).then(contactlist => {return contactlist;});
                let contactResult;
                if ((contacts.ok == true) && (contacts.contacts.Contacts.length > 0)) {
                    //Contact exists, update
                    contactResult = await update_contact(contacts.contacts.Contacts[0], user)
                        .then(res => {
                            if (res.ok == true){
                                console.log("Updated existing contact: ", contacts.contacts.Contacts[0].DisplayName);
                            }
                            return res;
                        });
                } else if ((contacts.ok == true) && (contacts.contacts.Contacts.length == 0)){
                    //Contact does not exist, insert
                    contactResult = await create_contact(user)
                        .then(res => {
                            if (res.ok == true){
                                console.log("Added new contact: ", user.displayName);
                            }
                            return res;
                        });
                } else if (contacts.ok == false) {
                    console.error('Failed to retrieve contacts: ', contacts.error);
                    return contacts;
                }

                if (contactResult.ok == true) {
                    if (CREATE_ADDRESSBOOK == 1){
                        let addressbook;
                        if (USE_GROUPNAME_FOR_ADDRESSBOOK == 1){
                            addressbook = USERGROUPS[gindex].Group;
                            if (!addressbook){
                                addressbook = DEFAULT_ADDRESS_BOOK;
                            }
                        } else {
                            addressbook = user[CREATE_ADDRESSBOOK_FIELD];
                            if (!addressbook){
                                addressbook = DEFAULT_ADDRESS_BOOK;
                            }
                        }
                        let addressBookExist = await search_address_books(addressbook)
                            .then(addressBookRes => {
                                return addressBookRes;
                        });
                                
                        if (addressBookExist.ok == true) {
                            if (addressBookExist.address_books.AddressBooks.length < 1){
                                // AddressBook does not exist, create it
                                let addressBookCreated = await create_address_book(addressbook)
                                    .then(addressBookRes => { 
                                        console.log('Create Address Book: ', addressbook);
                                        return addressBookRes;
                                    }).catch(error => console.error('ERROR ', error));
                                if ((addressBookCreated.ok == true) && (addressBookCreated.address_book_arn.AddressBookArn)) {
                                    // Associate contact to Address book
                                    await associate_contact_with_address_book(contactResult.contact_results.ContactArn, addressBookCreated.address_book_arn.AddressBookArn)
                                        .then(associated => {
                                            console.log('Contact: ' + user.displayName + ' associated with Address Book: ', addressbook);
                                        }).catch(error => console.error('ERROR ', error));
                                } else {
                                    console.error('Failed to create Address book: ', addressBookCreated.error);
                                }
                            } else {
                                // AddressBook exists, associate to contact
                                if ((contacts.contacts.Contacts.length > 0)) {
                                    if (contacts.contacts.Contacts[0].ContactArn){
                                        await associate_contact_with_address_book(contacts.contacts.Contacts[0].ContactArn, addressBookExist.address_books.AddressBooks[0].AddressBookArn)
                                            .then(associated => {
                                                console.log('Contact: ' + user.displayName + ' associated with Address Book: ', addressbook);
                                        }).catch(error => console.error('ERROR ', error));
                                    }
                                } else {
                                    if (contactResult.contact_results){
                                        await associate_contact_with_address_book(contactResult.contact_results.ContactArn, addressBookExist.address_books.AddressBooks[0].AddressBookArn)
                                            .then(associated => {
                                                console.log('Contact: ' + user.displayName + ' associated with Address Book: ', addressbook);
                                        }).catch(error => console.error('ERROR ', error));
                                    }
                                }
                            }
                        } else {
                            console.error('Failed to search for address books: ', addressBookExist.error);
                        }
                    }
                } else {
                    console.warn("Failed contact, ", contactResult.error);
                }
            }
            if ((uindex == USERGROUPS[gindex].Users.result.value.length-1) && (gindex < USERGROUPS.length)){
                gindex++;
                uindex=0;
            } else {
                uindex++;
            }
            await sleep(delay);
        }
        console.log('Completed import of users and groups');
    } else {
        console.error('Failed to get an access token');
    }
};