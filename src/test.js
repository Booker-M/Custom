import parse from './parser.js'
import util from "util"


const source = `
int main(int argc, char  argv){
    print("hello");
    if(x < y){
        print("YOOO");
        print('please work')
    }
    else {
        print('cry')
    }
    return 1;
}


`


console.log(util.format(parse(source)))


