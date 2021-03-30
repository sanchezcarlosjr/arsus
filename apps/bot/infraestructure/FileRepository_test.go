package infraestructure

import (
	"DialogFlowFulfilment/domain"
	"testing"
)

func TestItShouldIterateAboutFile(t *testing.T) {
	var tests = []struct {
		response      string
		discriminator domain.Discriminator
	}{
		{"Is it an animal", "Q"},
		{"Can it fly?", "Q"},
		{"Does it have wheels?", "Q"},
		{"bird", "A"},
		{"Does it have a tail?", "Q"},
		{"bicycle", "A"},
		{"Is it nice?", "Q"},
		{"mouse", "A"},
		{"spider", "A"},
		{"TA", "A"},
		{"teacher", "A"},
	}
	for _, tt := range tests {
		response, discriminator := DatabaseRepository().Actual()
		if response != tt.response && discriminator != tt.discriminator {
			t.Errorf("Response and discriminator should load from file. Got %s %s, want %s %s", response, discriminator, tt.response, tt.discriminator)
		}
		DatabaseRepository().NextIndex()
	}
}
