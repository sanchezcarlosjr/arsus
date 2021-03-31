package domain

type Discriminator string

const (
	QUESTION Discriminator = "Q"
	ANSWER   Discriminator = "A"
)

type DatabaseRepository interface {
	First()
	Previous()
	Next(response UserResponse)
	Actual() (string, Discriminator)
}
