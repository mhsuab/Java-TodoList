package io.github.mat3e.hello;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloServlet {
    // private variable within a class
    private final Logger logger = LoggerFactory.getLogger(HelloServlet.class);

    private HelloService service;

    HelloServlet(HelloService service) {
        this.service = service;
    }

    @GetMapping(value = "/api")
    String welcome() {
        return welcome(null, null);
    }

    @GetMapping(value = "/api", params = {"name", "lang"})
    String welcome(@RequestParam("lang") Integer langId, @RequestParam String name) {
        logger.info("Got request");
        return service.prepareGreeting(name, langId);
    }
}
