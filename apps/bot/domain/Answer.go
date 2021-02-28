package domain

type Answer struct {
	Response string
}

func (receiver Answer) Reply(stream StreamRepository) {
	stream.Interact(receiver.Response)
}
