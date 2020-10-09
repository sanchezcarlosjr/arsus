package main

import (
	"fmt"

	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"
)

var _ = Describe("Mexican", func() {
	It(`should convert to curp parameters`, func () {
		InitAdmin()
		mexican := Mexican{
			fatherName: "",
			motherName: "",
			name: "",
			gender: "1",
			birthday: "2000-10-29T00:00:00.000Z",
			birthState: "MX-BCN",
		};
		Expect(mexican.toCURPBirthState()).To(Equal("BC"))
		Expect(mexican.toCURPGender()).To(Equal("H"))
		Expect(mexican.toCURPBirthday()).To(Equal("2000-10-29"))
	})
	It(`should call to API`, func() {
		
		Expect(fmt.Sprintf("https://us-west4-arsus-production.cloudfunctions.net/curp?curp=%s&apiKey=%s", "alfa", "beta")).
			To(Equal("https://us-west4-arsus-production.cloudfunctions.net/curp?curp=alfa&apiKey=beta"))
	})
})