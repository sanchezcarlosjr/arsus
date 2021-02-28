package domain

type Question struct {
	Response string
	Yes      game
	No       game
	Maybe    game
}

func (receiver Question) Reply(stream StreamRepository) {
	userResponse := stream.Interact(receiver.Response)
	switch userResponse {
	case YES:
		receiver.Yes.Reply(stream)
		break
	case NO:
		receiver.No.Reply(stream)
		break
	case MAYBE:
		receiver.Maybe.Reply(stream)
	}
}
