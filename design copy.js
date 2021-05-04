class Camera{
  shot(car){
    return {
      num:car.num,
      time:Date.now()
    }
  }
}

class Place {
  constructor() {
    this.empty = true
  }

  inCar(car) {
    this.empty = false
  }

  outCar(car) {
    this.empty = true
  }
}

class Screen {
  show(car) {
    return {
      num: car.num,
      time: Date.now() -
    }
  }
}



class Park{
  constructor(num,places){
    this.num = num
    this.places = new Array(num * places).fill(new Place())
  }

  getEmptyPlacesNumber() {
    return this.places.filter(place => place.empty).length
  }
}

class Car {
  constructor(number) {
    this.number = number
  }
}


const park = new Park(3,100)

const car = new Car(123)

