import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Category } from '../types';

interface CategoryButtonProps {
  category: Category;
  isSelected: boolean;
  onPress: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ 
  category, 
  isSelected, 
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.buttonBase, 
        isSelected ? styles.buttonSelected : styles.button
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.textBase,
        isSelected ? styles.textSelected : styles.text
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: '#E5E7EB', // bg-gray-200
  },
  buttonSelected: {
    backgroundColor: '#3B82F6', // bg-blue-500
  },
  textBase: {
    fontWeight: '600',
  },
  text: {
    color: '#374151', // text-gray-700
  },
  textSelected: {
    color: '#FFFFFF', // text-white
  },
});

export default CategoryButton;