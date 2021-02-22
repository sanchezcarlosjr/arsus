package domain

import (
	"testing"
)

type UserResponseMock struct {
	want     string
	response UserResponse
}

type console struct {
	t       *testing.T
	index   int
	queries []UserResponseMock
}

func (receiver *console) interact(response string) UserResponse {
	query := receiver.queries[receiver.index]
	if response != query.want {
		receiver.t.Errorf("Error: Should be %s, but it is %s", query.want, response)
	}
	receiver.index++
	receiver.t.Log(response)
	return query.response
}

func TestItShouldMoveToNode(t *testing.T) {
	got := question{
		"Is it an animal?",
		question{
			"Can it fly?",
			answer{
				"Bird",
			},
			answer{
				"n",
			},
			answer{
				"m",
			},
		},
		answer{
			"Computer",
		},
		answer{
			"Superman",
		},
	}
	got.reply(&console{
		t,
		0,
		[]UserResponseMock{
			{
				"Is it an animal?",
				"y",
			},
			{
				"Can it fly?",
				"y",
			},
			{
				"Bird",
				"y",
			},
		},
	})
}
