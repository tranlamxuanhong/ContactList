$(document).ready(function() {
  loadContacts();
  addContact();
  updateContact();
});

function loadContacts() {
  clearContactTable();
  var contentRows = $("#contentRows");

  $.ajax({
    type: 'GET',
    url: 'http://contactlist.us-east-1.elasticbeanstalk.com/contacts',
    success: function(contactArray) {
      $.each(contactArray, function(index, value){
        var name = value.firstName + ' ' + value.lastName;
        var company = value.company;
        var contactId = value.contactId;

        var row = '<tr>';
            row += '<td>' + name + '</td>';
            row += '<td>' + company + '</td>';
            row += '<td><a role="button" class="btn  btn-info" onclick="showEditForm(' + contactId + ')">Edit</a></td>';
            row += '<td><button type="button" class="btn btn-danger" onclick="deleteContact(' + contactId +')">Delete</button></td>';
            row += '</tr>';
            contentRows.append(row);
      })
    },
    error: function() {
      $('#errorMessages')
          .append($('<li>')
          .attr({class: 'list-group-item list-group-item-danger'})
          .text('Error calling web service. Please try again later.'));
    }
  })
}

function addContact() {
    $('#addButton').click(function(event) {

      var haveValidationErrors = checkAndDisplayValidationErrors($('#addForm').find('input'));
      if(haveValidationErrors) {
        return false;
      }

      $.ajax({
        type:'POST',
        url:
        'http://contactlist.us-east-1.elasticbeanstalk.com/contact',
        data: JSON.stringify ({
          firstName: $('#addFirstName').val(),
          lastName: $('#addLastName').val(),
          company: $('#addCompany').val(),
          phone: $('#addPhone').val(),
          email: $('#addEmail').val()
        }),

      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      'dataType': 'json',
      success: function() {
        $('#errorMessages').empty();
        $('#addFirstName').val('');
        $('#addLastName').val('');
        $('#addCompany').val('');
        $('#addEmail').val('');
        $('#addPhone').val('');
        loadContacts();
      },
      error: function () {
        $('#errorMessages')
        .append('<li>')
        .attr({class: 'list-group-item list-group-item-danger'})
        .text('Error calling web service. Please try again later.');
      }
    })
  });
}


function clearContactTable() {
  $('#contentRows').empty();
}

function showEditForm(contactId) {
  $('#errorMessages').empty();
  $.ajax({
    type: 'GET',
    url: 'http://contactlist.us-east-1.elasticbeanstalk.com/contact/' + contactId,
    success: function(index, value) {
      $('#editFirstName').val(index.firstName);
      $('#editLastName').val(index.lastName);
      $('#editCompany').val(index.company);
      $('#editEmail').val(index.email);
      $('#editPhone').val(index.phone);
      $('#editContactId').val(index.contactId);
    },
    error: function() {
      $('#errorMessages')
        .append($('<li>')
        .attr({class: 'list-group-item list-group-item-danger'})
        .text('Error calling web service. Please try again later.'));
    }

  })
  $('#contactTable').hide();
  $('#editFormDiv').show();
}

function updateContact() {
    $('#updateButton').click(function(event) {

      var haveValidationErrors = checkAndDisplayValidationErrors($('#editForm').find('input'))
      if(haveValidationErrors) {
        return false;
      }
      
        $.ajax({
          type: 'PUT',
          url: 'http://contactlist.us-east-1.elasticbeanstalk.com/contact/' + $('#editContactId').val(),
          data: JSON.stringify({
            contactId: $('#editContactId').val(),
            firstName: $('#editFirstName').val(),
            lastName: $('#editLastName').val(),
            company: $('#editCompany').val(),
            email: $('#editEmail').val(),
            phone: $('#editPhone').val()

          }),
          headers: {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
          },
          'dataType' : 'json',
          success: function() {
            $('#errorMessages').empty();
            hideEditForm();
            loadContacts();
          },
          error: function() {
            $('#errorMessages')
              .append($('<li>')
              .attr({class: 'list-group-item list-group-item-danger'})
              .text('Error calling web service. Please try again later.'));
          }
        })
    })
}

function deleteContact(contactId) {
  $.ajax({
      type: 'DELETE',
      url: 'http://contactlist.us-east-1.elasticbeanstalk.com/contact/' + contactId,
      success: function() {
        loadContacts();
      }
  })
}

function hideEditForm() {
  $('#errorMessages').empty();
  $('#editFirstName').val('');
  $('#editLastName').val('');
  $('#editCompany').val('');
  $('#editPhone').val('');
  $('#editEmail').val('');
  $('#editFormDiv').hide();
  $('#contactTable').show();

}


function checkAndDisplayValidationErrors(input) {
  $('#errorMessages').empty();

  var errorMessages = [];

  input.each(function() {
    if(!this.validity.valid) {
      var errorField = $('label[for=' + this.id + ']').text();
      errorMessages.push(errorField + ' ' + this.validationMessage);
    }
  });

  if(errorMessages.length > 0) {
    $.each(errorMessages, function(index, message) {
      $('#errorMessages')
        .append($('<li>')
        .attr({class: 'list-group-item list-group-item-danger'})
        .text(message))
    })
      return true;
  } else {
      return false;
  }
}
