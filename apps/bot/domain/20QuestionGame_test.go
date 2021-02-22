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
			question{
				"Does it have a tail?",
				answer{
					"Mouse",
				},
				answer{
					"Spider",
				},
				answer{
					"Dragon",
				},
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
