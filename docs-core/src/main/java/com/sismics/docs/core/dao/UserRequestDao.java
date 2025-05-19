/*
package com.sismics.docs.core.dao;

import com.google.common.base.Joiner;
import com.google.common.base.Strings;
import at.favre.lib.crypto.bcrypt.BCrypt;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.sismics.docs.core.constant.AuditLogType;
import com.sismics.docs.core.constant.Constants;
import com.sismics.docs.core.dao.criteria.UserCriteria;
import com.sismics.docs.core.dao.dto.UserDto;
import com.sismics.docs.core.model.jpa.UserRequest;
import com.sismics.docs.core.util.AuditLogUtil;
import com.sismics.docs.core.util.EncryptionUtil;
import com.sismics.docs.core.util.jpa.QueryParam;
import com.sismics.docs.core.util.jpa.QueryUtil;
import com.sismics.docs.core.util.jpa.SortCriteria;
import com.sismics.util.context.ThreadLocalContext;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.Query;
import java.sql.Timestamp;
import java.util.*;

public class UserRequestDao {
    private final EntityManager entityManager;

    public UserRequestDao() {
        // 假设已通过某种方式获取 EntityManager（例如注入或工厂类）
        this.entityManager = PersistenceManager.getEntityManager();
    }

    */
/**
     * 创建新的用户请求
     *//*

    public void create(UserRequest request) {
        entityManager.getTransaction().begin();
        entityManager.persist(request);
        entityManager.getTransaction().commit();
    }

    */
/**
     * 获取所有待处理的请求（状态为 PENDING）
     *//*

    public List<UserRequest> findPending() {
        TypedQuery<UserRequest> query = entityManager.createQuery(
                "SELECT r FROM UserRequest r WHERE r.status = 'PENDING' ORDER BY r.createDate DESC",
                UserRequest.class
        );
        return query.getResultList();
    }

    */
/**
     * 根据 ID 获取请求
     *//*

    public UserRequest get(String id) {
        return entityManager.find(UserRequest.class, id);
    }

    */
/**
     * 更新请求状态
     *//*

    public void update(UserRequest request) {
        entityManager.getTransaction().begin();
        entityManager.merge(request);
        entityManager.getTransaction().commit();
    }
}*/
