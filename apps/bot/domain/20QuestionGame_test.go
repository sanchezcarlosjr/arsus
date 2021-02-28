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

func (receiver *console) Interact(response string) UserResponse {
	query := receiver.queries[receiver.index]
	if response != query.want {
		receiver.t.Errorf("Error: Should be %s, but it is %s", query.want, response)
	}
	receiver.index++
	receiver.t.Log(response)
	return query.response
}

func TestItShouldMoveToNode(t *testing.T) {
	got := Question{
		"Is it an animal?",
		Question{
			"Can it fly?",
			Answer{
				"Bird",
			},
			Question{
				"Does it have a tail?",
				Answer{
					"Mouse",
				},
				Answer{
					"Spider",
				},
				Answer{
					"Dragon",
				},
			},
			Answer{
				"m",
			},
		},
		Answer{
			"Computer",
		},
		Answer{
			"Superman",
		},
	}
	got.Reply(&console{
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
	got.Reply(&console{
		t,
		0,
		[]UserResponseMock{
			{
				"Is it an animal?",
				"y",
			},
			{
				"Can it fly?",
				"n",
			},
			{
				"Does it have a tail?",
				"y",
			},
			{
				"Mouse",
				"y",
			},
		},
	})
	got.Reply(&console{
		t,
		0,
		[]UserResponseMock{
			{
				"Is it an animal?",
				"y",
			},
			{
				"Can it fly?",
				"n",
			},
			{
				"Does it have a tail?",
				"n",
			},
			{
				"Spider",
				"y",
			},
		},
	})
	got.Reply(&console{
		t,
		0,
		[]UserResponseMock{
			{
				"Is it an animal?",
				"y",
			},
			{
				"Can it fly?",
				"n",
			},
			{
				"Does it have a tail?",
				"m",
			},
			{
				"Dragon",
				"y",
			},
		},
	})
}
