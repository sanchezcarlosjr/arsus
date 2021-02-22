package domain

type UserResponse string

const (
	YES   UserResponse = "y"
	NO    UserResponse = "n"
	MAYBE UserResponse = "m"
)

type StreamRepository interface {
	interact(response string) UserResponse
}

type game interface {
	reply(stream StreamRepository)
}

type answer struct {
	response string
}

func (receiver answer) reply(stream StreamRepository) {
	stream.interact(receiver.response)
}

type question struct {
	response string
	yes      game
	no       game
	maybe    game
}

func (receiver question) reply(stream StreamRepository) {
	userResponse := stream.interact(receiver.response)
	switch userResponse {
	case YES:
		receiver.yes.reply(stream)
		break
	case NO:
		receiver.no.reply(stream)
		break
	case MAYBE:
		receiver.maybe.reply(stream)
	}
}
