EventUtil.addHandler(window, 'load', function(event) {
    Todo = function() {};

    Todo.prototype = {
        todoListId : 0,
        todoListLength : 0,
        todoListComplete : 0,

        // 获取元素节点
        ndTodoInputBox : $('#j-todo-input-box'),
        ndTodoSelectAll : $('#j-select-all'),
        ndTodoList : $('#j-todo-list'),
        ndFooter : $('footer'),
        ndTodoListLength : $('#j-todo-list-length'),
        ndTodoClearComplete : $('#j-todo-clear-complete'),
        ndTodoListCompleteLength : $('#j-todo-complete-length'),

        initTodo : function() {
            var self = this;
            console.log(this);
            console.log(todo);

            // 设置tooter和清空按钮的显示
            this.setFooterDisplay();
            this.setClearButtonDisplay();
            this.clearAllComplete();
            this.selectAll();

            EventUtil.addHandler(document.forms[0], 'submit', function(event) {
                event = EventUtil.getEvent(event);
                EventUtil.preventDefault(event);

                // 添加一个项目
                var ndTodoItem = self.addTodoItem();

                // 显示footer和项目条数
                self.setFooterDisplay();
                self.update();

                // 编辑项目
                EventUtil.addHandler(ndTodoItem, 'dblclick', function(event) {
                    event = EventUtil.getEvent(event);
                    var target = EventUtil.getTarget(event);

                    self.editTodoItem(target);
                });

                var ndTodoCheckbox = ndTodoItem.querySelector('div input');
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

                    if (target.checked) {
                        ndTodoItem.querySelector('span').setAttribute('class', 'todo__item--complete');
                    } else {
                        ndTodoItem.querySelector('span').setAttribute('class', 'todo__item__content');
                    }
                    self.update();
                    self.setClearButtonDisplay();
                }

                function deleteTodoItem(event) {
                    event = EventUtil.getEvent(event);
                    var target = EventUtil.getTarget(event);
                    EventUtil.preventDefault(event);

                    EventUtil.removeHandler(ndTodoDelete, 'click', deleteTodoItem);
                    EventUtil.removeHandler(ndTodoCheckbox, 'click', changeStyle);

                    ndTodoDelete.parentNode.parentNode.parentNode.removeChild(ndTodoDelete.parentNode.parentNode);
                    
                    self.update();
                    self.setFooterDisplay();
                    self.setClearButtonDisplay();
                }
            });
        },
        
        addTodoItem : function() {
            var ndTodoItem = document.createElement('li');
            this.todoListId++;
            ndTodoItem.setAttribute('id', this.todoListId);
            ndTodoItem.setAttribute('class', 'todo__item');
            ndTodoItem.innerHTML = '<div class="todo__item__view"><input type="checkbox" name="todoChecked" class="todo__item--checked">' + '<span class="todo__item__content" id="j-todo-list-value">' + this.ndTodoInputBox.value + '</span>' + '<a class="todo__item--delete">删除</a></div><input type="text" class="todo__item--edit" maxlength="25">';
            this.ndTodoList.insertBefore(ndTodoItem, this.ndTodoList.firstChild);

            this.ndTodoInputBox.value = '';

            return ndTodoItem;
        },

        editTodoItem : function(element) {
            var ndEditInput = element.parentNode.nextSibling;

            ndEditInput.value = element.innerText;

            element.parentNode.style.display = 'none';
            ndEditInput.style.display = 'block';
            ndEditInput.focus();

            function changeText() {
                element.innerText = ndEditInput.value;
                element.parentNode.style.display = 'block';
                ndEditInput.style.display = 'none';
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

                var todoChecked = document.getElementsByName('todoChecked');
                for (var i=todoChecked.length-1; i>=0; i--) {
                    if (todoChecked[i].type == 'checkbox' && todoChecked[i].checked) {
                        todoChecked[i].parentNode.parentNode.parentNode.removeChild(todoChecked[i].parentNode.parentNode);
                    }
                }

                self.update();
                self.setClearButtonDisplay();
                self.setFooterDisplay();
            });
        },

        selectAll : function() {
            var self = this;
            // 给全选按钮添加事件
            EventUtil.addHandler(self.ndTodoSelectAll, 'click', function(event) {
                event = EventUtil.getEvent(event);
                var target = EventUtil.getTarget(event);

                if (target.checked) {
                    for (var i=0; i<self.ndTodoList.childNodes.length; i++) {
                        self.ndTodoList.childNodes[i].querySelector('input').checked = true;
                        self.ndTodoList.childNodes[i].querySelector('span').setAttribute('class', 'todo__item--complete');
                    }
                } else {
                    for (var i=0; i<self.ndTodoList.childNodes.length; i++) {
                        self.ndTodoList.childNodes[i].querySelector('input').checked = false;
                        self.ndTodoList.childNodes[i].querySelector('span').setAttribute('class', 'todo__item__content');
                    }
                }
                self.update();
                self.setClearButtonDisplay();
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

    var todo = new Todo();
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