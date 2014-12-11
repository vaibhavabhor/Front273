angular.module('AirNoteApp.noteServices', []).
    factory('notesAPIservice', function($http) {

        var notesAPI = {};

        notesAPI.getUserInfo = function(accessToken) {
            return $http({
                headers: {'Authorization': 'Bearer '+ accessToken},

                url: '//localhost:8080/api/users'
            });
        }

        notesAPI.listNotes = function(accessToken,userId) {
            return $http({
                headers: {'Authorization': 'Bearer '+ accessToken},
                url: '//localhost:8080/api/notes/' + userId
            });
        }

        notesAPI.listReminder = function(accessToken,userId) {
            return $http({
                headers: {'Authorization': 'Bearer '+ accessToken},
                url: '//localhost:8080/api/reminder/' + userId
            });
        }

        notesAPI.createNote = function(title, contents, accessToken, userId){
            console.log(title);
            console.log(contents);
            return $http({
                headers: {'Authorization': 'Bearer '+ accessToken},
                url: '//localhost:8080/api/notes',
                data: {"title": title,
                    "content": contents,
                    "userId": userId
                },
                method: 'POST'
            });
        }

        notesAPI.createReminder = function(dateTime, contents, email, userId){
            console.log(dateTime);
            console.log(contents);
            return $http({
                //headers: {'Authorization': 'Bearer '+ accessToken},
                url: '//localhost:8080/api/reminder',
                data: {"emailId": email,
                    "content": contents,
                    "userId": userId,
                    "eventAt": dateTime
                },
                method: 'POST'
            });
        }

        notesAPI.fetchNote = function(accessToken, userId, noteId){
            return $http({
                headers: {'Authorization': 'Bearer '+ accessToken},
                url: 'http://localhost:8080/api/notes/'+ userId +'/'+noteId
                //url: 'http://localhost:8080/api/notes/'+ userId +'/54562835a8262eb8960d7f04'
                });
        }

        notesAPI.fetchReminder = function(accessToken, userId, reminderId){
            return $http({
                headers: {'Authorization': 'Bearer '+ accessToken},
                url: 'localhost:8080/api/reminder/'+ userId +'/'+reminderId
                //url: 'http://localhost:8080/api/notes/'+ userId +'/54562835a8262eb8960d7f04'
            });
        }

        notesAPI.updateNote = function(title, contents, noteId, accessToken, userId){
            return $http({
                headers: {'Authorization': 'Bearer '+ accessToken},
                url: 'http://localhost:8080/api/notes/'+userId +'/'+ noteId ,
                data: {"title": title,
                    "content": contents
                },
                method: 'PUT'
            })
        }

        notesAPI.updateReminder = function(eventAt, contents, reminderId, accessToken, userId){
            return $http({
                headers: {'Authorization': 'Bearer '+ accessToken},
                url: 'localhost:8080/api/reminder/'+userId +'/'+ reminderId ,
                data: {"eventAt": eventAt,
                    "content": contents
                    //"noteId": "547a7c0c0364648b83bc8170"
                },
                method: 'PUT'
            })
        }

        notesAPI.deleteNote = function(accessToken, userId, noteId){
            console.log('note id' + noteId);
            return $http({
                headers: {'Authorization': 'Bearer '+accessToken},
                url: 'http://localhost:8080/api/notes/'+userId+'/'+ noteId,
                //url: 'http://localhost:8080/api/notes/'+userId+'/54562835a8262eb8960d7f04',
                method: 'DELETE'
            })
        }

        notesAPI.deleteReminder = function(accessToken, userId, reminderId){
            console.log('note id' + reminderId);
            return $http({
                headers: {'Authorization': 'Bearer '+accessToken},
                url: 'localhost:8080/api/reminder/'+userId+'/'+ reminderId,
                //url: 'http://localhost:8080/api/notes/'+userId+'/54562835a8262eb8960d7f04',
                method: 'DELETE'
            })
        }

        return notesAPI;
    });
