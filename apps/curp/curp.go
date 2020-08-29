package curp

import (
  "encoding/json"
  "net/http"
)

type Response struct {
  Curp    string
  FatherName string
  MotherName string
  Name string
  Gender string
  Birthday   string
  BirthState string
}

func Curp(w http.ResponseWriter, r *http.Request) {
  curpResponse := Response{"", "", "", "", "", "", ""}
  send(w, curpResponse)
}

func send(w http.ResponseWriter, curpResponse Response) {
  js, err := json.Marshal(curpResponse)
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
    return
  }
  w.Header().Set("Content-Type", "application/json")
  w.Write(js)
}
