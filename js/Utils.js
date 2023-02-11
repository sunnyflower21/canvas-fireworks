export const randomNumBetween = (min, max) => {
  return Math.random() * (max - min) + min;
};

//innerWidth와 innerHeight 의 빗변의 길이를 구함
export const hypotenuse = (x, y) => {
  //밑변의 제곱 더하기 높이 제곱을 루트로 씌움 => 빗변길이
  return Math.sqrt(Math.pow(x, 2) + Math.pow(2, y));
};
