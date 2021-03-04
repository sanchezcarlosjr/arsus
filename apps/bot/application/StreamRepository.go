package application

type UserResponse int

const (
	YES   UserResponse = 0
	NO    UserResponse = 1
	MAYBE UserResponse = 2
)

type StreamRepository interface {
	Interact(response string) UserResponse
  InteractAsAnswer(response string)
}

