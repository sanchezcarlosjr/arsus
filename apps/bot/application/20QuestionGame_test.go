package application

import (
	"testing"
)

func TestItShouldMoveToNode(t *testing.T) {
	question := Question{}
	question.add(&Question{
		Response: "A",
	})
	t.Logf("%v", question.children[0])
}
