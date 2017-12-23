const emptyList = () => {
  const thisNode = {
    value: () => null,
    next: () => null,
    push: (pushed) => newListNode(pushed, thisNode),
    pop: () => thisNode,
    length: () => 0,
    toString: calledByNode => calledByNode ? ')' : '()',
  };
  return thisNode;
};

const newListNode = (value, next = emptyList()) => {
  const thisNode = {
    value: () => value,
    next: () => next,
    push: (pushed) => newListNode(pushed, thisNode),
    pop: () => thisNode.next(),
    length: () => 1 + thisNode.next().length(),
    toString: calledByNode => (!calledByNode ? '(' : ' ') + thisNode.value() + thisNode.next().toString(true),
  };
  return thisNode;
};

const list10 = emptyList().push(5).push(4).push(3).push(2).push(1)

console.log(emptyList().toString())
console.log(emptyList().push(6).toString())
console.log(list10.toString())
console.log(list10.push(16).pop() === list10)
