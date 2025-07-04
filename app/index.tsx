import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CHARACTER_LIMIT = 50;

const initialEntries = [
  { date: 'Monday 30th', description: 'went for a walk' },
  { date: 'Tuesday 1st', description: 'played Minecraft with a friend' },
  { date: 'Wednesday 2nd', description: 'made tea' },
];

export default function HomeScreen() {
  const [entries, setEntries] = useState(initialEntries);
  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState('');

  const handleAddEntry = () => {
    if (input.trim().length > 0) {
      const today = new Date();
      const dateStr = today.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
      setEntries([...entries, { date: dateStr, description: input.trim() }]);
      setInput('');
      setAdding(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.header}>July 2025</Text>
      <View style={styles.entriesRow}>
        <View style={styles.verticalLine} />
        <FlatList
          data={entries}
          keyExtractor={(_, idx) => idx.toString()}
          style={styles.entriesList}
          contentContainerStyle={styles.entriesContent}
          renderItem={({ item }) => (
            <View style={styles.entryItem}>
              <Text style={styles.entryDate}>{item.date}</Text>
              <Text style={styles.entryDesc}>{item.description}</Text>
            </View>
          )}
        />
      </View>
      {!adding && (
        <TouchableOpacity style={styles.addButton} onPress={() => setAdding(true)}>
          <Text style={styles.addButtonText}>add entry today</Text>
        </TouchableOpacity>
      )}
      {adding && (
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Today's entry</Text>
          <Text style={styles.charCount}>{input.length}/{CHARACTER_LIMIT}</Text>
          <TextInput
            style={styles.textInput}
            placeholder="start typing here"
            value={input}
            onChangeText={text => text.length <= CHARACTER_LIMIT && setInput(text)}
            multiline
            maxLength={CHARACTER_LIMIT}
            autoFocus
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleAddEntry}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '300',
  },
  entriesRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  verticalLine: {
    width: 2,
    backgroundColor: '#bbb',
    marginRight: 24,
    borderRadius: 1,
    alignSelf: 'stretch',
  },
  entriesList: {
    flex: 1,
  },
  entriesContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  entryItem: {
    marginBottom: 32,
    minHeight: 60,
  },
  entryDate: {
    fontSize: 22,
    fontWeight: '400',
    marginBottom: 2,
  },
  entryDesc: {
    fontSize: 16,
    color: '#444',
    marginLeft: 2,
    minHeight: 40,
  },
  addButton: {
    backgroundColor: '#e0e0e0',
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  addButtonText: {
    color: '#444',
    fontSize: 16,
  },
  inputContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  charCount: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  textInput: {
    minHeight: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#bbb',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

