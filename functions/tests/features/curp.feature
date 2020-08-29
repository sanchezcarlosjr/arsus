Feature: Obtain people data with a standard ISO
  In order to verify CURP from government
  As a developer
  I want to know curp, surname, gender, birthday, birthState

  Scenario: With valid CURP ID and valid apiKey
    Given I send a GET request to "/?curp=jjj&apiKey=ij"
    Then the response body should be
    """
    {
      "curp": "",
      "surname": "",
      "name": "",
      "gender": "",
      "birthday": "",
      "birthState": ""
    }
    """
