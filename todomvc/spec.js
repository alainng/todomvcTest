describe('TODOS Spec', function() {
    
    function addTodo(newTodoTitle) { 
        element(by.model('newTodo')).sendKeys(newTodoTitle,protractor.Key.ENTER);
    }
    function toggleTodo(index){ 
        element.all(by.model('todo.completed')).get(index).click()
    }
  
    function toggleAllTodo(){ 
        element(by.id('toggle-all')).click()
    }
  
    function expectTodoCount(number){
        expect(element.all(by.repeater('todo in todos | filter:statusFilter track by $index')).count()).toEqual(number)
    }
  
    function clearCompleted(){ 
        element(by.id("clear-completed")).click()
    }
  
    function deleteTodo(index){
        browser.waitForAngular();
        var todoElem = element.all(by.model('todo.completed')).get(index)
        browser.actions().mouseMove(todoElem).perform(); //hover to show x
        var xButtonElem = element(by.css('[ng-click="removeTodo(todo)"]'))
        xButtonElem.click();
    }
  
    function editTodo(index,newTodoTitle){
        var todoElem = element.all(by.css('[ng-dblclick="editTodo(todo)"]')).get(index)
        browser.actions().doubleClick(todoElem).perform();
        var textInputElem = element.all(by.model("todo.title")).get(index)
        browser.actions().doubleClick(textInputElem).perform();
        textInputElem.sendKeys(protractor.Key.BACK_SPACE)
        textInputElem.sendKeys(newTodoTitle,protractor.Key.ENTER)
    }
    function editTodoAndCancel(index,newTodoTitle){ 
        var todoElem = element.all(by.css('[ng-dblclick="editTodo(todo)"]')).get(index)
        browser.actions().doubleClick(todoElem).perform();
        var textInputElem = element.all(by.model("todo.title")).get(index)
        browser.actions().doubleClick(textInputElem).perform();
        textInputElem.sendKeys(protractor.Key.BACK_SPACE)
        textInputElem.sendKeys(newTodoTitle)
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform()
    }
  
    function getElementText(index){
        return element.all(by.repeater('todo in todos | filter:statusFilter track by $index')).get(index).getText()
    }
  
    function switchView(option){
        switch(option){
            case "all":
                browser.get('http://todomvc.com/examples/angularjs/#/')
                break;
            case "active":
                browser.get('http://todomvc.com/examples/angularjs/#/active')
                break;
            case "completed":
                browser.get('http://todomvc.com/examples/angularjs/#/completed')
                break;
        }
    }
      
    beforeAll(function(){
        browser.get('http://todomvc.com/examples/angularjs/#/');
    });
  
    beforeEach(function(){
        switchView("all")
    });
  
    afterEach(function() {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });
  
    it('adds a todo', function() {   
        addTodo("testTodo!@#$%!#3123%^#")  
        expect(getElementText(0)).toBe("testTodo!@#$%!#3123%^#")
        expectTodoCount(1)
    });
    
    it('does not add empty named todos', function() {   
        addTodo("")  
        expectTodoCount(0)
    });

    it('toggles the first todo from active to completed by clicking the circle on the left of the todo', function() {   
        addTodo("hehehehe") 
        expectTodoCount(1)
        toggleTodo(0) //index starts at 0...
        switchView("active")
        expectTodoCount(0)
        switchView("completed")
        expectTodoCount(1)
    });
    
    it('toggles the first todo from completed back to active by clicking the circle on the left of the todo', function() {   
        addTodo("hehehehe") 
        expectTodoCount(1)
        toggleTodo(0)
        switchView("active")
        expectTodoCount(0)
        switchView("completed")
        expectTodoCount(1)
        toggleTodo(0)
        expectTodoCount(0)
        switchView("active")
        expectTodoCount(1)
    });
  
    it('can clear completed todos', function() {   
        addTodo("hehehehe") 
        expectTodoCount(1)
        toggleTodo(0)
        expectTodoCount(1)
        switchView("completed")
        expectTodoCount(1)
        clearCompleted()
        expectTodoCount(0)
    });
  
    it('deletes the first todo by clicking the X on the right of the todo', function() {   
        addTodo("hehehehe") 
        expectTodoCount(1)
        deleteTodo(0)
        expectTodoCount(0)
    });
  
    it('edit the first todo and saves the changes', function() {   
        addTodo("hehehehe")
        expect(getElementText(0)).toBe("hehehehe")        
        expectTodoCount(1)
        editTodo(0,"crap")
        expectTodoCount(1)
        expect(getElementText(0)).toBe("crap")
        addTodo("test") 
        expectTodoCount(2)
        editTodo(1,"crap2")
        expect(getElementText(1)).toBe("crap2")
    });
  
    it('edits the first todo and cancels the edit', function() {   
        addTodo("hehehehe") 
        expectTodoCount(1)
        editTodoAndCancel(0,"crap2")
        expectTodoCount(1)
        expect(getElementText(0)).toBe("hehehehe")
    });
    
    it('edits the first todo to "" resulting in deleting the todo', function() {   
        addTodo("hehehehe") 
        expectTodoCount(1)
        editTodo(0,"")
        expectTodoCount(0)
    });
   
    it('can toggle all todos to completed', function() {   
        addTodo("hehehehe")
        addTodo("hehehehe") 
        addTodo("hehehehe")
        expectTodoCount(3)
        toggleAllTodo()
        switchView("completed")
        expectTodoCount(3)
    });
    
    it('can toggle all todos from completed to active', function() {   
        addTodo("hehehehe")
        addTodo("hehehehe") 
        addTodo("hehehehe")
        expectTodoCount(3)
        toggleAllTodo()
        switchView("completed")
        expectTodoCount(3)
        toggleAllTodo()
        expectTodoCount(0)
        switchView("active")
        expectTodoCount(3)
    });
 
});
