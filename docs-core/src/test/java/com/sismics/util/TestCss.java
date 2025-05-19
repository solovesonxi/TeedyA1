package com.sismics.util;

import org.junit.Test;

import com.sismics.util.css.Selector;

/**
 * Test of CSS utilities.
 * 
 * @author bgamard
 */
public class TestCss {
    @Test
    public void testBuildCss() {
        Selector selector = new Selector(".test")
            .rule("background-color", "yellow")
            .rule("font-family", "Comic Sans");
        System.out.println(selector);
    }
    @Test
    public void testBuildCssWithMultipleRules() {
        Selector selector = new Selector("#header")
                .rule("width", "100%")
                .rule("height", "60px")
                .rule("background-color", "#333")
                .rule("color", "#fff")
                .rule("text-align", "center");


        System.out.println(selector.toString());
    }
}
