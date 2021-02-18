package io.github.mat3e.todo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/todos")
class TodoServlet {
    private final Logger logger = LoggerFactory.getLogger(TodoServlet.class);
    private TodoService service;

    TodoServlet(TodoService service) {
        this.service = service;
    }

    @GetMapping
    ResponseEntity<List<Todo>> findAllTodos() {
        logger.info("Got request");
        return ResponseEntity.ok(service.findAll());
    }

    @PutMapping("/{id}")
    ResponseEntity<Todo> toggleTodo(@PathVariable Integer id) {
        Todo status =  service.toggleTodoById(id);
        logger.info("todo status");
        logger.info(String.valueOf(status));
        if (status == null) return ResponseEntity.notFound().build();
        else {
            logger.info("success");
            return ResponseEntity.ok(status);
        }
    }

    @PostMapping
    ResponseEntity<Todo> saveTodo(@RequestBody Todo todo) {
        return ResponseEntity.ok(service.saveTodo(todo));
    }

    @DeleteMapping("/{id}")
    ResponseEntity<Integer> deleteTodo(@PathVariable Integer id) {
        if (service.deleteTodo(id)) return ResponseEntity.ok(id);
        else return ResponseEntity.notFound().build();
    }
}
