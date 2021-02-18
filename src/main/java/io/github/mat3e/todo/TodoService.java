package io.github.mat3e.todo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;

@Service
public class TodoService {
    private final Logger logger = LoggerFactory.getLogger(TodoService.class);
    private final TodoRepository repository;

    TodoService(TodoRepository repository) { this.repository = repository; }

    List<Todo> findAll() {
        return repository.findAll()
                .stream()
                .collect(toList());
    }

    Optional<Todo> findTodoById(Integer id) {
        return repository.findById(id);
    }

    Todo toggleTodoById(Integer id) {
        Optional<Todo> todo = findTodoById(id);
        if (todo.isPresent()) {
            Todo t = todo.get();
            t.setDone(!t.isDone());
            repository.save(t);
            return t;
        }
        return null;
    }

    Todo saveTodo(Todo todo) {
        return repository.save(todo);
    }

    boolean deleteTodo(Integer id) {
        Optional<Todo> todo = findTodoById(id);
        if (todo.isPresent()) {
            repository.deleteById(id);
            return true;
        }
        else return false;
    }
}
