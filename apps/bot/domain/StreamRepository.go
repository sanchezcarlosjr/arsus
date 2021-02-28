package domain

type UserResponse string

const (
	YES   UserResponse = "y"
	NO    UserResponse = "n"
	MAYBE UserResponse = "m"
)

type StreamRepository interface {
	Interact(response string) UserResponse
}
