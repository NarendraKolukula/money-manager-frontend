package com.moneymanager.service;

import com.moneymanager.dto.CategoryDTO;
import com.moneymanager.exception.ResourceNotFoundException;
import com.moneymanager.model.Category;
import com.moneymanager.model.TransactionType;
import com.moneymanager.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public List<CategoryDTO> getCategoriesByType(TransactionType type) {
        return categoryRepository.findByType(type)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    public CategoryDTO getCategoryById(String id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return toDTO(category);
    }
    
    public CategoryDTO createCategory(CategoryDTO dto) {
        Category category = Category.builder()
                .id(dto.getId())
                .name(dto.getName())
                .icon(dto.getIcon())
                .type(dto.getType())
                .build();
        
        Category saved = categoryRepository.save(category);
        log.info("Created category: {} - {}", saved.getId(), saved.getName());
        
        return toDTO(saved);
    }
    
    public CategoryDTO updateCategory(String id, CategoryDTO dto) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        
        existing.setName(dto.getName());
        existing.setIcon(dto.getIcon());
        existing.setType(dto.getType());
        
        Category saved = categoryRepository.save(existing);
        log.info("Updated category: {}", saved.getId());
        
        return toDTO(saved);
    }
    
    public void deleteCategory(String id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
        log.info("Deleted category: {}", id);
    }
    
    private CategoryDTO toDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .icon(category.getIcon())
                .type(category.getType())
                .build();
    }
}
