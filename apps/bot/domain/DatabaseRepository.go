package domain

type Discriminator string

const (
	QUESTION Discriminator = "Q"
	ANSWER   Discriminator = "A"
)

type DatabaseRepository interface {
	Row(index int) (string, Discriminator)
	Length() int
}
