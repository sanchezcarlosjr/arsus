package application

import (
	"DialogFlowFulfilment/domain"
	"DialogFlowFulfilment/infraestructure"
	"testing"
)

func NewStreamMock(t *testing.T, mock []InteractionMock) {
	infraestructure.SetStreamRepository(&StreamMock{
		t:           t,
		index:       0,
		interaction: mock,
	})
}

type InteractionMock struct {
	want            string
	userInteraction domain.UserResponse
}

type StreamMock struct {
	t           *testing.T
	index       int
	interaction []InteractionMock
}

func (receiver StreamMock) InteractAsAnswer(response string) {
	if response != receiver.interaction[receiver.index].want {
		receiver.t.Errorf("Got %s, want %s", response, receiver.interaction[receiver.index].want)
	}
}

func (receiver StreamMock) Interact(response string) domain.UserResponse {
	if response != receiver.interaction[receiver.index].want {
		receiver.t.Errorf("Got %s, want %s", response, receiver.interaction[receiver.index].want)
	}
	receiver.index++
	return receiver.interaction[receiver.index-1].userInteraction
}

func TestItShouldMoveToNode(t *testing.T) {
	NewStreamMock(t, []InteractionMock{
		{"Is it an animal?", domain.YES},
		{"Can it fly", domain.YES},
		{"bird", 0},
	})
	gameManger := GameManger{
		SizeChildren: 2,
	}
	gameManger.Start()
}
