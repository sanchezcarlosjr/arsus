package curp

import (
  "net/http/httptest"
  "strings"
  "testing"
)

func TestCurp(t *testing.T) {
  tests := []struct {
    target string
    body   string
    want string
  }{
    {body: ``, target: "/curp/ccc?apiKey='a'", want: "{\"Curp\":\"ccc\",\"FatherName\":\"\",\"MotherName\":\"\",\"Name\":\"\",\"Gender\":\"\",\"Birthday\":\"\",\"BirthState\":\"\"}"},
  }
  for _, test := range tests {
    req := httptest.NewRequest("GET", test.target, strings.NewReader(test.body))
    req.Header.Add("Content-Type", "application/json")
    rr := httptest.NewRecorder()
    curp(rr, req)
    if got := rr.Body.String(); got != test.want {
      t.Errorf("Curp(%q) = %q, want %q", test.body, got, test.want)
    }
  }
}
