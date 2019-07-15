package uniqueNtoSumZero

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestResultSumZero(t *testing.T) {
	classLevelBase := AllowQuantity / 16

	for idx, leng := 2, AllowQuantity+1; idx < leng; idx++ {
		level := (idx/classLevelBase + 1) << 4
		_TestResultSumZero_once(t, idx, level)
	}
}

func _TestResultSumZero_once(t *testing.T, quantity, times int) {
	for loop := times; loop > 0; loop-- {
		list := Solution(quantity)

		assert.Equal(t, quantity, len(list), "數組數量不符合預期。")

		sum := 0
		for idx, leng := 0, len(list); idx < leng; idx++ {
			sum += list[idx]
		}
		assert.Equal(t, 0, sum, "總和不為 0。")
	}
}
