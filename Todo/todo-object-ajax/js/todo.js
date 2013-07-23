function Todo(ndTodoSync, ndTodoInputBox, ndTodoSelectAll, ndTodoList, ndFooter, ndTodoListLength, ndTodoClearComplete, ndTodoListCompleteLength) {
    this.ndTodoSync = ndTodoSync;
    this.ndTodoInputBox = ndTodoInputBox;
    this.ndTodoSelectAll = ndTodoSelectAll;
    this.ndTodoList = ndTodoList;
    this.ndFooter = ndFooter;
    this.ndTodoListLength = ndTodoListLength;
    this.ndTodoClearComplete = ndTodoClearComplete;
    this.ndTodoListCompleteLength = ndTodoListCompleteLength;

    this.todoListLength = 0;
    this.todoListComplete = 0;
    this.ndTodoItem = null;
}

Todo.prototype = {
    createXHR : function() {
        if (typeof XMLHttpRequest != 'undefined') {
            return new XMLHttpRequest();
        } else if (typeof ActiveXObject != 'undefined') {
            if (typeof arguments.callee.activeXString != 'string') {
                var versions = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0','MSXML.XMLHttp'];
                for (var i=0,len=versions.length; i<len; i++) {
                    try {
                        var xhr = new ActiveXObject(versions[i]);
                        arguments.callee.activeXString = versions[i];
                        return xhr;
                    } catch (ex) {
                        //
                    }
                }
            }
            return new ActiveXObject(arguments.callee.activeXString);
        }
    },

    request : function(url, method, data, callback) {
        var self = this;

        self.ndTodoSync.style.display = 'block';
        var xhr = this.createXHR();

        // 在准备状态变化时执行
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                self.ndTodoSync.style.display = 'none';
                // console.log(url);
                // console.log(data);
                var response = JSON.parse(xhr.responseText);
                callback(response);
            }
        }

        // NOTE POST请求需要设置额外的Header
        xhr.open(method, url, true);
        if (method.toLowerCase() == 'post') {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        xhr.send(data);
    },

    initTodo : function() {
        var self = this;

        // 获取全部数据并添加到页面
        self.request('/cakephp-2.3.7/todos', 'get', null, function (response) {
            for (var i=0; i<response.length; i++) {
                self.addTodoItem(response[i]);
            }

            self.update();
            self.setFooterDisplay();
            self.clearAllComplete();
            self.selectAll();
        });

        EventUtil.addHandler(document.forms[0], 'submit', function(event) {
            event = EventUtil.getEvent(event);
            EventUtil.preventDefault(event);

            // 添加一个todoItem
            var todoInputValue = encodeURIComponent(self.ndTodoInputBox.value);
            self.ndTodoInputBox.value = '';
            self.request('/cakephp-2.3.7/todos/add', 'post', 'data[content]=' + todoInputValue, function(response) {
                if (response.status == true) {
                    self.addTodoItem(response.data);
                }
            });
            
        });
    },
    
    addTodoItem : function(todoItem) {
        var self = this;
        
        // 创建一个todoItem
        ndTodoItem = document.createElement('li');
        ndTodoItem.setAttribute('class', 'todo__item');
        ndTodoItem.setAttribute('id', todoItem.Todo.id);
        ndTodoItem.innerHTML = '<div class="todo__item__view"><input type="checkbox" name="todoChecked" class="todo__item__checked">' + '<span class="todo__item__content" id="j-todo-list-value">' + todoItem.Todo.content + '</span>' + '<a class="todo__item__delete"></a></div><input type="text" class="todo__item__edit" maxlength="25">';
        
        // 在加载完毕判断todoItem是否完成
        if (todoItem.Todo.completed == true) {
            ndTodoItem.querySelector('input[type=checkbox]').setAttribute('checked', true);
            ndTodoItem.querySelector('span').setAttribute('class', 'todo__item__complete');
        } else {
            ndTodoItem.querySelector('span').setAttribute('class', 'todo__item__content');
        }

        self.ndTodoList.insertBefore(ndTodoItem, self.ndTodoList.firstChild);

        // 显示footer和项目条数
        self.update();
        self.setFooterDisplay();

        // 编辑todoItem
        EventUtil.addHandler(ndTodoItem, 'dblclick', function(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);
            self.editTodoItem(target);
        });

        // 获取todoItem的复选框和删除按钮
        var ndTodoCheckbox = ndTodoItem.querySelector('div input[type=checkbox]');
        var ndTodoDelete = ndTodoItem.querySelector('a');

        if (ndTodoCheckbox) {
            EventUtil.addHandler(ndTodoCheckbox, 'click', changeStyle);
        }

        if (ndTodoDelete) {
            EventUtil.addHandler(ndTodoDelete, 'click', deleteTodoItem);
        }

        function changeStyle(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);

            var completed = target.checked ? 1 : 0;

            var todoItemId = encodeURIComponent(target.parentNode.parentNode.id);
            self.request('/cakephp-2.3.7/todos/complete/' + todoItemId + '/' + completed, 'get', null, function(response) {
                if (response.status == true) {
                    if (completed) {
                        target.parentNode.parentNode.querySelector('span').setAttribute('class', 'todo__item__complete');
                    } else {
                        target.parentNode.parentNode.querySelector('span').setAttribute('class', 'todo__item__content');
                    }
                }

                self.update();
                self.setClearButtonDisplay();
            });
            
        }

        function deleteTodoItem(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);
            EventUtil.preventDefault(event);

            // 在删除todoItem时删除其绑定删除事件和改变样式事件
            EventUtil.removeHandler(ndTodoDelete, 'click', deleteTodoItem);
            EventUtil.removeHandler(ndTodoCheckbox, 'click', changeStyle);

            var todoItemId = encodeURIComponent(target.parentNode.parentNode.id);

            self.request('/cakephp-2.3.7/todos/delete/' + todoItemId, 'get', null, function(response) {
                if (response.status == true) {
                    target.parentNode.parentNode.parentNode.removeChild(target.parentNode.parentNode);
                }

                self.update();
                self.setFooterDisplay();
                self.setClearButtonDisplay();
            });     
        }
    },

    editTodoItem : function(element) {
        var self = this;

        // 在编辑时将显示元素替换成输入框
        var ndEditInput = element.parentNode.nextSibling;
        ndEditInput.value = element.innerText;
        element.parentNode.style.display = 'none';
        ndEditInput.style.display = 'block';
        ndEditInput.focus();

        function changeText() {
            // 将编辑输入框的文本显示出来
            element.innerText = ndEditInput.value;
            element.parentNode.style.display = 'block';
            ndEditInput.style.display = 'none';

            var todoItemId = encodeURIComponent(element.parentNode.parentNode.id);
            self.request('/cakephp-2.3.7/todos/edit/' + todoItemId, 'post', 'data[content]=' + ndEditInput.value, function(response) {});
        }

        EventUtil.addHandler(ndEditInput, 'blur', function(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);

            changeText();
        });

        EventUtil.addHandler(ndEditInput, 'keydown', function(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);

            if (event.keyCode == 13) {
               changeText();
            }
        });
    },

    clearAllComplete : function() {
        var self = this;

        // 清空所有已完成项目
        EventUtil.addHandler(self.ndTodoClearComplete, 'click', function(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);

            var todoLists = document.getElementsByTagName('li');

            for (var i=0; i<todoLists.length; i++) {
                if (todoLists[i].querySelector('input[type=checkbox]').checked) {
                    self.request('/cakephp-2.3.7/todos/delete/' + todoLists[i].id, 'get', null, (function(element) {
                        return function(response) {
                            if (response.status == true) {
                                // console.log(element);
                                element.parentNode.removeChild(element);

                                self.update();
                                self.setClearButtonDisplay();
                                self.setFooterDisplay();
                            }
                        };
                    })(todoLists[i]));
                }
            }
        });
    },

    selectAll : function() {
        var self = this;

        // 给全选按钮添加事件
        EventUtil.addHandler(self.ndTodoSelectAll, 'click', function(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);

            var completed = target.checked ? 1 : 0;

            if (completed) {
                for (var i=0; i<self.ndTodoList.childNodes.length; i++) {
                    if (self.ndTodoList.childNodes[i].querySelector('input[type=checkbox]').checked == false) {
                        self.request('/cakephp-2.3.7/todos/complete/' + self.ndTodoList.childNodes[i].id + '/' + completed, 'get', null, (function(element) {
                            return function(response) {
                                if (response.status == true) {
                                    element.querySelector('input[type=checkbox]').checked = true;
                                    element.querySelector('span').setAttribute('class', 'todo__item__complete');
                                }
                                self.update();
                                self.setClearButtonDisplay();
                            } 
                        })(self.ndTodoList.childNodes[i]));
                    }
                }
            } else {
                for (var i=0; i<self.ndTodoList.childNodes.length; i++) {
                    self.request('/cakephp-2.3.7/todos/complete/' + self.ndTodoList.childNodes[i].id + '/' + completed, 'get', null, (function(element) {
                        return function(response) {
                            if (response.status == true) {
                                element.querySelector('input[type=checkbox]').checked = false;
                                element.querySelector('span').setAttribute('class', 'todo__item__content');
                            }
                            self.update();
                            self.setClearButtonDisplay();
                        } 
                    })(self.ndTodoList.childNodes[i]));
                }
            }
        });
    },

    // 设置footer显示
    setFooterDisplay : function() {
        if (this.ndTodoList.childNodes.length == 0) {
            this.ndFooter.style.display = 'none';
            this.ndTodoSelectAll.style.display = 'none';
        } else {
            this.ndFooter.style.display = 'block';
            this.ndTodoSelectAll.style.display = 'block';
        }
    },

    // 设置清空按钮显示
    setClearButtonDisplay : function() {
        var hasCompletedTodo = false;

        for (var i=0; i<this.ndTodoList.childNodes.length; i++) {
            if (this.ndTodoList.childNodes[i].querySelector('input').checked) {
                hasCompletedTodo = true;
                break;
            }
        }

        if (hasCompletedTodo) {
            this.ndTodoClearComplete.style.display = 'block';
        } else {
            this.ndTodoClearComplete.style.display = 'none';
        }
    },

    // 更新数据
    update : function() {
        // 计算选中个数和未选中的个数
        this.todoListComplete = 0;
        for (var i=0; i<this.ndTodoList.childNodes.length; i++) {
            var ndCheckbox = this.ndTodoList.childNodes[i].querySelector('input');
            if (ndCheckbox.type == 'checkbox' && ndCheckbox.checked == true) {
                this.todoListComplete++;
            }
        }
        this.todoListLength = this.ndTodoList.childNodes.length - this.todoListComplete;
        this.ndTodoListLength.innerText = this.todoListLength;
        this.ndTodoListCompleteLength.innerText = this.todoListComplete;

        // 判断是否全选
        var isAllChecked = true;
        for (var i=0; i<this.ndTodoList.childNodes.length; i++) {
            var ndCheckbox = this.ndTodoList.childNodes[i].querySelector('input');
            if (ndCheckbox.type == 'checkbox' && ndCheckbox.checked == true) {
            } else {
                isAllChecked = false;
                break;
            }
        }

        if (isAllChecked == true) {
            this.ndTodoSelectAll.querySelector('input').checked = true;
        } else {
            this.ndTodoSelectAll.querySelector('input').checked = false;
        }
    }
}

EventUtil.addHandler(window, 'load', function(event) {
    var ndTodoSync = $('#j-todo-sync');
    var ndTodoInputBox = $('#j-todo-input-box');
    var ndTodoSelectAll = $('#j-select-all');
    var ndTodoList = $('#j-todo-list');
    var ndFooter = $('footer');
    var ndTodoListLength = $('#j-todo-list-length');
    var ndTodoClearComplete = $('#j-todo-clear-complete');
    var ndTodoListCompleteLength = $('#j-todo-complete-length');

    var todo = new Todo(ndTodoSync, ndTodoInputBox, ndTodoSelectAll, ndTodoList, ndFooter, ndTodoListLength, ndTodoClearComplete, ndTodoListCompleteLength);
    todo.initTodo();
});

function $(selector) {
    if (document.querySelector) {
        return document.querySelector(selector);
    }
    if (selector.indexOf('#') === 0) {
        selector = selector.replace('#', '');
        return document.getElementById(selector);
    }
}
