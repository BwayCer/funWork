package uniqueNtoSumZero

import (
	"fmt"
	"math/rand"
	"sort"
	"strconv"
	"strings"
)

func init() {
	AllowQuantity = GetMaxUniqueCutHalfLength(NumberMaxInt) * 2
}

const (
	BitOfPlatform = 32 << (^uint(0) >> 63)
	NumberMaxInt  = 1<<(BitOfPlatform-1) - 1
)

var AllowQuantity int

func Solution(n int) []int {
	switch n {
	case 1:
		return []int{0}
	case 2:
		rand := 1 + rand.Intn(NumberMaxInt)
		return []int{-1 * rand, rand}
	default:
		halfAllowQuantity := AllowQuantity / 2
		quantity := n
		list := make([]int, 0, n)

		// TODO 0 的機率該怎麼分配 ?
		// 但希望是可以在 plusQuantity, minusQuantity 計算出來之前取得
		var zeroQuantity int
		if n < halfAllowQuantity {
			zeroQuantity = n
		} else {
			zeroQuantity = halfAllowQuantity
		}
		zeroMinUniqueCutHalfValue := GetMinUniqueCutHalfValue(zeroQuantity)
		if rand.Intn(zeroMinUniqueCutHalfValue) == 0 {
			list = append(list, 0)
			quantity--
		}

		var plusQuantity int
		if quantity > halfAllowQuantity {
			necessaryOffset := quantity - halfAllowQuantity
			bufQuantity := halfAllowQuantity - necessaryOffset
			plusQuantity = necessaryOffset + randIntn(bufQuantity)
		} else {
			plusQuantity = 1 + rand.Intn(quantity-1)
		}
		minusQuantity := quantity - plusQuantity
		thanBigQuantity := plusQuantity
		if plusQuantity < minusQuantity {
			thanBigQuantity = minusQuantity
		}

		minUniqueCutHalfValue := GetMinUniqueCutHalfValue(thanBigQuantity)
		randValue := minUniqueCutHalfValue + randIntn(NumberMaxInt-minUniqueCutHalfValue)

		// fmt.Printf("plusQuantity: %d; minusQuantity: %d\n", plusQuantity, minusQuantity)
		handleUniqueRandomList(&list, 1, GetUniqueCutHalfList(randValue, plusQuantity))
		handleUniqueRandomList(&list, -1, GetUniqueCutHalfList(randValue, minusQuantity))

		sort.Ints(list)
		return list
	}
}

// 與 rand.Intn() 函式功能相同， 不同的是當 n == 0 時返回 0。
func randIntn(n int) int {
	if n == 0 {
		return 0
	} else {
		return rand.Intn(n)
	}
}

// 取得最大對半切唯一值數組長度。
// panic("value 為介於整數 [0,NumberMaxInt] 的範圍。")
func GetMaxUniqueCutHalfLength(value int) int {
	if value < 0 || NumberMaxInt < value {
		panic(fmt.Sprintf("value %d 超出整數 [0,%d] 的範圍。", value, NumberMaxInt))
	}

	switch value {
	case 0:
		return 0
	case 1, 2:
		return 1
	default:
		var bitLength int
		valueBits := strconv.FormatInt(int64(value), 2)
		bitLength = len(valueBits)
		all1Bits := strings.Repeat("1", bitLength)
		if valueBits != all1Bits {
			bitLength--
		}
		return 2 + (bitLength - 2)
	}
}

// 取得最小可對半切唯一值數組的數值。
// panic("quantity 為介於整數 [1,AllowQuantity/2] 的範圍。")
func GetMinUniqueCutHalfValue(quantity int) int {
	halfAllowQuantity := AllowQuantity / 2
	if quantity < 1 || halfAllowQuantity < quantity {
		panic(fmt.Sprintf("quantity 的值 %d 超出整數 [2,%d] 的範圍。", quantity, halfAllowQuantity))
	} else if quantity == 1 {
		return 1
	} else {
		all1Bits := strings.Repeat("1", quantity)
		all1Bit, _ := strconv.ParseInt(all1Bits, 2, 0)
		return int(all1Bit)
	}
}

// 取得對半切唯一值數組。
func GetUniqueCutHalfList(value, quantity int) []int {
	list := make([]int, quantity)

	if quantity == 1 {
		list[0] = value
	} else {
		lastIdx := quantity - 1
		var tmpNewVal int
		for val := value; lastIdx > 0; lastIdx-- {
			tmpNewVal = val >> 1

			tmpAnotherAnsVal := tmpNewVal + 1
			if val%2 == 0 {
				tmpNewVal = tmpNewVal - 1
			}

			list[lastIdx] = tmpAnotherAnsVal
			val = tmpNewVal
		}
		list[lastIdx] = tmpNewVal
	}

	// fmt.Printf("(quantity: %d) (value: %d) %#v\n", quantity, value, list)
	return list
}

func handleUniqueRandomList(listPtr *[]int, plusMinus int, uniqueCutHalfList []int) {
	list := *listPtr

	var maxValue int
	idx := 0
	minValue := 0
	accumulation := 0

	for leng := len(uniqueCutHalfList) - 1; idx < leng; idx++ {
		maxValue = accumulation + uniqueCutHalfList[idx]
		randValue := minValue + 1 + rand.Intn(maxValue-minValue)
		minValue = randValue
		accumulation = maxValue - randValue
		list = append(list, plusMinus*randValue)
	}
	maxValue = accumulation + uniqueCutHalfList[idx]
	list = append(list, plusMinus*maxValue)

	*listPtr = list
}
