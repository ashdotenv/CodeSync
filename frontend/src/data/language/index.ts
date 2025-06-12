export const LANGUAGE_MAPPING: {
    [key: string]: {
      name: string;
      monaco: string;
      boilerplate: string;
    };
  } = {
    js: {
      name: "JavaScript",
      monaco: "javascript",
      boilerplate: `// JavaScript Boilerplate
  function helloWorld() {
    console.log("Hello, World!");
  }
  helloWorld();`
    },
    cpp: {
      name: "C++",
      monaco: "cpp",
      boilerplate: `// C++ Boilerplate
  #include <iostream>
  
  int main() {
      std::cout << "Hello, World!" << std::endl;
      return 0;
  }`
    },
    rs: {
      name: "Rust",
      monaco: "rust",
      boilerplate: `// Rust Boilerplate
  fn main() {
      println!("Hello, World!");
  }`
    },
    java: {
      name: "Java",
      monaco: "java",
      boilerplate: `// Java Boilerplate
  public class Main {
      public static void main(String[] args) {
          System.out.println("Hello, World!");
      }
  }`
    },
  };
  