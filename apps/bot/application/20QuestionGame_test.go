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
	gameManger := GameManger{}
	gameManger.Start()
	infraestructure.DatabaseRepository().First()
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

func (receiver *StreamMock) InteractAsAnswer(response string) {
	if response != receiver.interaction[receiver.index].want {
		receiver.t.Errorf("Got %s, want %s", response, receiver.interaction[receiver.index].want)
	}
}

func (receiver *StreamMock) Interact(response string) domain.UserResponse {
	if response != receiver.interaction[receiver.index].want {
		receiver.t.Errorf("Got %s, want %s", response, receiver.interaction[receiver.index].want)
	}
	receiver.index++
	return receiver.interaction[receiver.index-1].userInteraction
}

func TestPath1(t *testing.T) {
	NewStreamMock(t, []InteractionMock{
		{"Is it an animal?", domain.YES},
		{"Can it fly?", domain.YES},
		{"bird", 0},
	})
}

func TestPath2(t *testing.T) {
	NewStreamMock(t, []InteractionMock{
		{"Is it an animal?", domain.YES},
		{"Can it fly?", domain.NO},
		{"Does it have a tail?", domain.YES},
		{"mouse", 0},
	})
}

func TestPath3(t *testing.T) {
	NewStreamMock(t, []InteractionMock{
		{"Is it an animal?", domain.YES},
		{"Can it fly?", domain.NO},
		{"Does it have a tail?", domain.NO},
		{"spider", 0},
	})
}

func TestPath4(t *testing.T) {
	NewStreamMock(t, []InteractionMock{
		{"Is it an animal?", domain.NO},
		{"Does it have wheels?", domain.YES},
		{"bicycle", 0},
	})
}

func TestPath5(t *testing.T) {
	NewStreamMock(t, []InteractionMock{
		{"Is it an animal?", domain.NO},
		{"Does it have wheels?", domain.NO},
		{"Is it nice?", domain.NO},
		{"teacher", 0},
	})
}

func TestPath6(t *testing.T) {
	NewStreamMock(t, []InteractionMock{
		{"Is it an animal?", domain.NO},
		{"Does it have wheels?", domain.NO},
		{"Is it nice?", domain.YES},
		{"TA", 0},
	})
}
