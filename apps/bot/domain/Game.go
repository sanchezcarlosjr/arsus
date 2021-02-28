package domain

type game interface {
	Reply(stream StreamRepository)
}
