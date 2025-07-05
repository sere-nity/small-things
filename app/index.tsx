import { useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

function getOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function HomePage() {
    const initialEntries = [
        { date: 'Monday 1st', description: 'Made tea' },
        { date: 'Tuesday 2nd', description: 'Went for a walk' },
        { date: 'Wednesday 3rd', description: 'Read a book' },
    ];

    const CHARACTER_LIMIT = 50;

    const [entries, setEntries] = useState(initialEntries);
    const [adding, setAdding]  = useState(false);
    const [input, setInput] = useState('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    

    const getTodayDateString = () => {
        const today = new Date();
        const weekday = today.toLocaleDateString('en-US', { weekday: 'long' });
        const day = today.getDate();
        return `${weekday} ${getOrdinal(day)}`;
    };

    const hasEntryForToday = () => {
        const todayDateString = getTodayDateString();
        return entries.some(entry => entry.date === todayDateString);
    };

    const handleAddEntry = () => {
        if (input.trim() === '') {
            // if input is empty, do not add entry
            return;
        }

        // add entry to list 
        const newEntry = {
            date: getTodayDateString(),
            description: input,
        };

        setEntries(prevEntries => [...prevEntries, newEntry]);

        setAdding(false);
        setInput('');
    }

    const handleEditEntry = (index: number) => {
        setEditingIndex(index);
        setInput(entries[index].description);
    }

    const handleSaveEdit = () => {
        if (input.trim() === '') {
            return;
        }

        setEntries(prevEntries => 
            prevEntries.map((entry, index) => 
                index === editingIndex 
                    ? { ...entry, description: input }
                    : entry
            )
        );

        setEditingIndex(null);
        setInput('');
    }

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setInput('');
    }

    return (
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <Text style={styles.header}>July 2025</Text>
            <View style={styles.entriesRow}>
                <View style={styles.verticalLine} />
                <FlatList
                    data={entries}
                    style={styles.entriesList}
                    renderItem={({ item, index }) => (
                        <View style={styles.entryItem}>
                            <Text style={styles.entryDate}>{item.date}</Text>
                            <TouchableOpacity onPress={() => handleEditEntry(index)}>
                                <Text style={styles.entryDesc}>{item.description}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
            {/* add entry button should only appear when we are not adding an entry and there's no entry for today and not editing */}
            {!adding && !hasEntryForToday() && editingIndex === null && (
                <TouchableOpacity style={styles.addButton} onPress={() => setAdding(true)}>
                    <Text style={styles.addButtonText}>Add Entry</Text>
                </TouchableOpacity>
            )}
            {/* Show message when entry already exists for today */}
            {!adding && hasEntryForToday() && editingIndex === null && (
                <View style={styles.todayCompleteContainer}>
                    <Text style={styles.todayCompleteText}>You've already added an entry for today!</Text>
                </View>
            )}
            {/* if we are adding an entry or editing an entry, show the input fields */}
            {(adding || editingIndex !== null) && (
                <View style={styles.inputContainer}>
                    <View style={styles.labelRow}>
                        <Text style={styles.inputLabel}>
                            {adding ? "Today's Entry" : `Edit ${entries[editingIndex!].date}`}
                        </Text>
                        <Text style={styles.charCount}>{input.length}/{CHARACTER_LIMIT}</Text>
                    </View>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Write your entry here..."
                        maxLength={CHARACTER_LIMIT}
                        value={input}
                        multiline
                        onChangeText={text => setInput(text)}
                        autoFocus
                    />
                    <View style={styles.buttonRow}>
                        <TouchableOpacity 
                            style={styles.submitButton} 
                            onPress={adding ? handleAddEntry : handleSaveEdit}
                        >
                            <Text style={styles.submitButtonText}>
                                {adding ? "Submit" : "Save"}
                            </Text>
                        </TouchableOpacity>
                        {editingIndex !== null && (
                            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}


// styles 
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    flex: 1,
    backgroundColor: '#bbb',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayCompleteContainer: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  todayCompleteText: {
    color: '#4a7c59',
    fontSize: 16,
    textAlign: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
});
