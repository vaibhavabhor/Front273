var controller = angular.module('AirNoteApp.controllers', ['ngCookies']);

controller.config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;

    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

controller.controller('notesController', function ($scope, notesAPIservice, $cookies, $cookieStore) {
    var userId = $cookies.uid;
    var accessToken = $cookies.accessToken;
    $scope.nameFilter = null;
    $scope.notesList = [];
    $scope.username = null;
    $scope.noteId = null;
    $scope.reminderId = null;
    $scope.note = null;
    $scope.reminder = null;
    $scope.currentNoteId=null;
    $scope.currentReminderId=null;
    $scope.skipCounter=0;
    $scope.skipCounterReminder=0;
    $scope.totalCount = 0;
    $scope.totalCountReminder = 0;

    $scope.create = function() {
        //$scope.msg = 'clicked';
        var title = document.getElementById("createTitle").value;
        var contents = document.getElementById("createContent").value;
        console.log('Clicked!!');

        if(title=="" && contents=="")
        {
            $scope.errorMessage = "Please enter note title and contents!";
        }
        else if(title==""){
            $scope.errorMessage = "Note title can not be blank!";
        }
        else if(contents=="")
        {
            $scope.errorMessage = "Note content can not be blank!";
        }
        else
        {
            notesAPIservice.createNote(title, contents, accessToken, userId).success(function (response) {
                $scope.noteId = response.noteId;
                console.log('note id is' + $scope.noteId);
            });

            location.reload();
        }
               //var title = document.getElementById("createTitle").value;
        //var contents = document.getElementById("createContent").value;
    }

    $scope.createRem = function() {
        //$scope.msg = 'clicked';
        var dateTime = "2014-10-12T12:08:56.235-0700";
        var contents = document.getElementById("editContent").value;
        console.log('Clicked!!');

        if(dateTime=="" && contents=="")
        {
            $scope.errorMessage = "Please enter reminder title and contents!";
        }
        else if(dateTime==""){
            $scope.errorMessage = "reminder schedule can not be blank!";
        }
        else if(contents=="")
        {
            $scope.errorMessage = "reminder content can not be blank!";
        }
        else
        {
            var email = $cookies.email;
            notesAPIservice.createReminder(dateTime, contents, email, userId).success(function (response) {
                $scope.reminderId = response.reminderId;
                console.log('reminder id is' + $scope.reminderId);
            });

            location.reload();
        }
        //var title = document.getElementById("createTitle").value;
        //var contents = document.getElementById("createContent").value;
    }

    $scope.prevClicked = function(){
        console.log('prev was clicked!');
        if($scope.skipCounter < 10 )
        {
            //document.getElementById("createTitle");
            console.log("Prev click disable!");
        }
        else
        {
            $scope.skipCounter = $scope.skipCounter - 10;
            notesAPIservice.listNotes(accessToken, userId, $scope.skipCounter).success(function (response) {
                $scope.notesList = response.notes;
                $scope.totalCount = response.totalNotes;
                var notesDecorators = [];
                var myNote = null;
                $scope.notesList.forEach(function (note) {
                    console.log(note.title);
                    myNote = new DecoratedNote(note);
                    notesDecorators.push(myNote);
                });
                console.log(notesDecorators.length);
                $scope.noteDecoratorList = notesDecorators;
            }).error(function (data) {
                $scope.notesList = []
            });
        }

    }

    $scope.nextClicked =  function(){
        console.log('next was clicked!!');
        console.log("total count is"+$scope.totalCount);
        console.log("total skip count is"+$scope.skipCounter);
        if(($scope.totalCount - $scope.skipCounter) < 10){
            console.log("Next click disable!");

        }
        else
        {
            $scope.skipCounter = $scope.skipCounter + 10;
            notesAPIservice.listNotes(accessToken, userId, $scope.skipCounter).success(function (response) {
                $scope.notesList = response.notes;
                $scope.totalCount = response.totalNotes;
                var notesDecorators = [];
                var myNote = null;
                $scope.notesList.forEach(function (note) {
                    console.log(note.title);
                    myNote = new DecoratedNote(note);
                    notesDecorators.push(myNote);
                });
                console.log(notesDecorators.length);
                $scope.noteDecoratorList = notesDecorators;
            }).error(function (data) {
                $scope.notesList = []
            });
        }


    }

    $scope.update = function() {
        console.log(' update clicked');
        var title = document.getElementById("updateTitle").value;
        var contents = document.getElementById("editContent").value;
        notesAPIservice.updateNote(title,contents,$scope.currentNoteId,accessToken,userId).success(function(response){
          //$scope.noteId = response.noteId;
        });
    }

    $scope.updateRem = function() {
        console.log(' update clicked');
        var dateTime = "2014-10-12T12:08:56.235-0700";
        var contents = document.getElementById("editContent").value;
        notesAPIservice.updateReminder(dateTime,contents,$scope.currentReminderId,accessToken,userId).success(function(response){
            //$scope.noteId = response.noteId;
            //notesAPI.updateReminder = function(eventAt, contents, reminderId, accessToken, userId){
        });
    }

    $scope.delete = function(){
        console.log('delete clicked!! for '  + $scope.currentNoteId);
        notesAPIservice.deleteNote(accessToken, userId, $scope.currentNoteId).success(function (response) {
            console.log('Deleted');
        });
    }

    $scope.deleteRem = function(){
        console.log('delete clicked!! for '  + $scope.currentNoteId);
        notesAPIservice.deleteReminder(accessToken, userId, $scope.currentReminderId).success(function (response) {
            console.log('Deleted');
        });
    }

    notesAPIservice.getUserInfo(accessToken).success(function (response) {
        $scope.username = response.display_name

    }).error(function (data, status, headers, config) {
        $scope.username = "oops we had an error!"
    });

    notesAPIservice.listNotes(accessToken, userId, 0).success(function (response) {
        $scope.notesList = response.notes;
        $scope.totalCount = response.totalNotes;
        var notesDecorators = [];
        var myNote = null;
        $scope.notesList.forEach(function (note) {
            console.log(note.title);
            myNote = new DecoratedNote(note);
            //myNote.setCurrentNote();
            notesDecorators.push(myNote);
        });
        console.log(notesDecorators.length);
        $scope.noteDecoratorList = notesDecorators;
    }).error(function (data) {
        $scope.notesList = []
    });

    function DecoratedNote(note) {
        this.note = note;
        this.noteId = note.noteId;
        this.setCurrentNote = function () {
            console.log("Click done at" + note.title);
            $scope.clickedNoteTitle = note.title;
             notesAPIservice.fetchNote(accessToken, userId, this.noteId).success(function (response) {
                //$scope.note = response;
                 $scope.currentNoteContent = response.content;
                 $scope.currentNoteId = response.noteId;
            });
        };
    }

    notesAPIservice.listReminders(accessToken, userId, 0).success(function (response) {
        $scope.reminderList = response.reminder;
        $scope.totalCountReminder = response.totalReminder;
        var reminderDecorators = [];
        var myReminder = null;
        $scope.reminderList.forEach(function (reminder) {
            //console.log(note.title);
            myReminder = new DecoratedReminder(reminder);
            //myNote.setCurrentNote();
            reminderDecorators.push(myReminder);
        });
        console.log(reminderDecorators.length);
        $scope.reminderDecoratorsList = reminderDecorators;
    }).error(function (data) {
        $scope.reminderList = []
    });

    function DecoratedReminder(reminder) {
        this.reminder = reminder;
        this.reminderId = reminder.reminderId;
        this.setCurrentReminder = function () {
            //console.log("Click done at" + reminder.title);
            //$scope.clickedNoteTitle = reminder.title;
            notesAPIservice.fetchReminder(accessToken, userId, this.reminderId).success(function (response) {
                //$scope.note = response;
                $scope.currentReminderContent = response.content;
                $scope.currentReminderId = response.reminderId;
            });
        };
    }

$scope.reload = function(){
    location.reload();
}

    $scope.clear = function() {
        $scope.newNoteTitle = "";
        $scope.newNoteContent = "";};





    });

