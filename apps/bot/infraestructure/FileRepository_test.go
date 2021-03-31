package infraestructure

import (
	"DialogFlowFulfilment/domain"
	"testing"
)

type FileRepositoryTest struct {
	response     string
	userResponse domain.UserResponse
	index        int
}

func Path(t *testing.T, tests []FileRepositoryTest) {
	file := NewFileRepository("../questions.txt").(*FileRepository)
	for _, tt := range tests {
		response, _ := file.Actual()
		if tt.index != file.index {
			t.Errorf("Got %d, want index %d", file.index, tt.index)
		}
		if tt.response != response {
			t.Errorf("Got %s, want response %s", response, tt.response)
		}
		file.Next(tt.userResponse)
	}
}

func TestPath1(t *testing.T) {
	Path(t, []FileRepositoryTest{
		{"Is it an animal?", domain.YES, 0},
		{"Can it fly?", domain.YES, 1},
		{"bird", 0, 3},
	})
}

func TestPath2(t *testing.T) {
	Path(t, []FileRepositoryTest{
		{"Is it an animal?", domain.YES, 0},
		{"Can it fly?", domain.NO, 1},
		{"Does it have a tail?", domain.YES, 4},
		{"mouse", 0, 9},
	})
}

func TestPath3(t *testing.T) {
	Path(t, []FileRepositoryTest{
		{"Is it an animal?", domain.YES, 0},
		{"Can it fly?", domain.NO, 1},
		{"Does it have a tail?", domain.NO, 4},
		{"spider", 0, 10},
	})
}

func TestPath4(t *testing.T) {
	Path(t, []FileRepositoryTest{
		{"Is it an animal?", domain.NO, 0},
		{"Does it have wheels?", domain.YES, 2},
		{"bicycle", 0, 5},
	})
}
