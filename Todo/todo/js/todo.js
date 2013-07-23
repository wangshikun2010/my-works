EventUtil.addHandler(window, 'load', function(event) {
    var todoListId = 0;
    var todoListLength = 0;
    var todoListComplete = 0;

    // 获取元素节点
    var ndTodoInputBox = $('#j-todo-input-box');
    var ndTodoSelectAll = $('#j-select-all');
    var ndTodoList = $('#j-todo-list');
    var ndFooter = $('footer');
    var ndTodoListLength = $('#j-todo-list-length');
    var ndTodoListComplete = $('#j-todo-list-complete');
    var ndTodoClearComplete = $('#j-todo-clear-complete');
    
    // 设置tooter和清空按钮的显示
    setFooterDisplay();
    setClearButtonDisplay();

    EventUtil.addHandler(document.forms[0], 'submit', function(event) {
        event = EventUtil.getEvent(event);
        EventUtil.preventDefault(event);

        // add a todo list element
        var ndTodoItem = document.createElement('li');
        todoListId++;
        ndTodoItem.setAttribute('id', todoListId);
        ndTodoItem.innerHTML =  '<input type="checkbox" name="todoChecked" class="todo-list-checked">' +
                                '<span class="todo-list-content">' + ndTodoInputBox.value + '</span>' + 
                                '<a class="todo-list-delete">删除</a>';
        ndTodoList.insertBefore(ndTodoItem, ndTodoList.firstChild);

        ndTodoInputBox.value = '';

        // 显示footer和项目条数
        setFooterDisplay();
        update();

        // 编辑项目
        EventUtil.addHandler(ndTodoItem, 'dblclick', function(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);

            // 获取原有的值
            console.log(target);
            var todoItemValue = target.innerText;
            var todoItemHTML = target.parentNode.innerHTML;
            console.log(todoItemValue);
            console.log(todoItemHTML);
            var ndForm = '<form><input type="text" class="todo-input-box" value=' + todoItemValue + '/></form>';

            // 创建输入框并将原有的值作为默认值
            ndTodoItem.innerHTML = ndForm;
            console.log(ndTodoItem.innerHTML);
            ndTodoItem.focus();
            console.log(ndTodoItem);

            function editTodoItem(event) {
                event = EventUtil.getEvent(event);
                var target = EventUtil.getTarget(event);
                EventUtil.preventDefault(event);

                console.log(target);
                console.log(target.value);

                ndTodoItem.innerHTML = '<input type="checkbox" name="todoChecked" class="todo-list-checked">' +
                                       '<span class="todo-list-content">' + target.value + '</span>' + 
                                       '<a class="todo-list-delete">删除</a>';

                var ndTodoCheckbox = ndTodoItem.querySelector('input');
                var ndTodoDelete = ndTodoItem.querySelector('a');

                if (ndTodoCheckbox) {
                    EventUtil.addHandler(ndTodoCheckbox, 'click', changeStyle);
                }

                if (ndTodoDelete) {
                    EventUtil.addHandler(ndTodoDelete, 'click', deleteTodoItem);
                }

                update();
            }

            EventUtil.addHandler(ndTodoItem.querySelector('input'), 'blur', editTodoItem);
            EventUtil.addHandler(ndTodoItem.querySelector('input'), 'submit', editTodoItem);

        });

        var ndTodoCheckbox = ndTodoItem.querySelector('input');
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
                ndTodoItem.querySelector('span').setAttribute('class', 'todo-list-complete');
            } else {
                ndTodoItem.querySelector('span').setAttribute('class', 'todo-list-content');
            }
            update();
            setClearButtonDisplay();
        }

        function deleteTodoItem(event) {
            event = EventUtil.getEvent(event);
            var target = EventUtil.getTarget(event);
            EventUtil.preventDefault(event);

            EventUtil.removeHandler(ndTodoDelete, 'click', deleteTodoItem);
            EventUtil.removeHandler(ndTodoCheckbox, 'click', changeStyle);

            ndTodoDelete.parentNode.parentNode.removeChild(ndTodoDelete.parentNode);
            
            update();
            setFooterDisplay();
            setClearButtonDisplay();
        } 
    });

    // 清空完成添加事件
    EventUtil.addHandler(ndTodoClearComplete, 'click', function(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);

        // for (var i=0, todolist=ndTodoList.childNodes, len=todolist.length; i<len; i++) {
        //     console.log(todolist[i].id);
        //     if (todolist[i].querySelector('input').checked) {
        //         ndTodoList.removeChild(todolist[i]);
        //     }
        // }

        var todoChecked = document.getElementsByName('todoChecked');
        for (var i=0; i<todoChecked.length; i++) {
            if (todoChecked[i].type == 'checkbox' && todoChecked[i].checked) {
                todoChecked[i].parentNode.parentNode.removeChild(todoChecked[i].parentNode);
            }
        }
        update();
    });

    // 给全选按钮添加事件
    EventUtil.addHandler(ndTodoSelectAll, 'click', function(event) {
        event = EventUtil.getEvent(event);
        var target = EventUtil.getTarget(event);

        if (target.checked) {
            for (var i=0; i<ndTodoList.childNodes.length; i++) {
                ndTodoList.childNodes[i].querySelector('input').checked = true;
            }
        } else {
            for (var i=0; i<ndTodoList.childNodes.length; i++) {
                ndTodoList.childNodes[i].querySelector('input').checked = false;
            }
        }
        update();
        setClearButtonDisplay();
    });

    // 设置footer显示
    function setFooterDisplay() {
        if (ndTodoList.childNodes.length == 0) {
            ndFooter.style.display = 'none';
            ndTodoSelectAll.style.display = 'none';
        } else {
            ndFooter.style.display = 'block';
            ndTodoSelectAll.style.display = 'block';
        }
    }

    // 设置清空按钮显示
    function setClearButtonDisplay() {
        var hasCompletedTodo = false;

        for (var i=0; i<ndTodoList.childNodes.length; i++) {
            if (ndTodoList.childNodes[i].querySelector('input').checked) {
                hasCompletedTodo = true;
                break;
            }
        }

        if (hasCompletedTodo) {
            ndTodoClearComplete.style.display = 'block';
        } else {
            ndTodoClearComplete.style.display = 'none';
        }

    }

    // 更新数据
    function update() {
        todoListComplete = 0;
        for (var i=0; i<ndTodoList.childNodes.length; i++) {
            var ndCheckbox = ndTodoList.childNodes[i].querySelector('input');
            if (ndCheckbox.type == 'checkbox' && ndCheckbox.checked == true) {
                todoListComplete++;
            }
        }
        todoListLength = ndTodoList.childNodes.length - todoListComplete;
        ndTodoListLength.innerText = todoListLength;
        ndTodoListComplete.innerText = todoListComplete;

        if (ndTodoList.childNodes.length == 0) {
            ndTodoSelectAll.style.display = 'none';
        }

        var isAllChecked = true;
        for (var i=0; i<ndTodoList.childNodes.length; i++) {
            var ndCheckbox = ndTodoList.childNodes[i].querySelector('input');
            if (ndCheckbox.type == 'checkbox' && ndCheckbox.checked == true) {
            } else {
                isAllChecked = false;
                break;
            }
        }

        if (isAllChecked == true) {
            ndTodoSelectAll.firstChild.checked = true;
        }
    }

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