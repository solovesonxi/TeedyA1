package com.sismics.util;

import jakarta.json.JsonValue;

import org.junit.Assert;
import org.junit.Test;
public class TestJsonUtil {

    @Test
    public void testNullableString() {
        // 测试非空字符串
        JsonValue jsonValue = JsonUtil.nullable("Hello, World!");
        Assert.assertNotNull(jsonValue);
        Assert.assertEquals("Hello, World!", jsonValue.toString());

        // 测试空字符串
        JsonValue emptyJsonValue = JsonUtil.nullable("");
        Assert.assertNotNull(emptyJsonValue);
        Assert.assertEquals("\"\"", emptyJsonValue.toString());

        // 测试 null 字符串
        JsonValue nullJsonValue = JsonUtil.nullable((String) null);
        Assert.assertEquals(JsonValue.NULL, nullJsonValue);
    }

    @Test
    public void testNullableInteger() {
        // 测试非空整数
        JsonValue jsonValue = JsonUtil.nullable(123);
        Assert.assertNotNull(jsonValue);
        Assert.assertEquals(123, jsonValue);

        // 测试零值
        JsonValue zeroJsonValue = JsonUtil.nullable(0);
        Assert.assertNotNull(zeroJsonValue);
        Assert.assertEquals(0, zeroJsonValue);

        // 测试 null 整数
        JsonValue nullJsonValue = JsonUtil.nullable((Integer) null);
        Assert.assertEquals(JsonValue.NULL, nullJsonValue);
    }

    @Test
    public void testNullableLong() {
        // 测试非空长整数
        JsonValue jsonValue = JsonUtil.nullable(1234567890123L);
        Assert.assertNotNull(jsonValue);
        Assert.assertEquals(1234567890123L, jsonValue);

        // 测试零值
        JsonValue zeroJsonValue = JsonUtil.nullable(0L);
        Assert.assertNotNull(zeroJsonValue);
        Assert.assertEquals(0L, zeroJsonValue);

        // 测试 null 长整数
        JsonValue nullJsonValue = JsonUtil.nullable((Long) null);
        Assert.assertEquals(JsonValue.NULL, nullJsonValue);
    }


}