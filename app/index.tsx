import { useState } from "react";
import { FlatList, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function HomePage() {

    // Organise entries by month (nested dictionary)
    const entriesByMonth: Record<string, { date: string, description: string }[]> = {
       ['June 2025']: [
        { date: 'Thursday 1st', description: 'Started a new project' },
        { date: 'Friday 2nd', description: 'Went to the gym' },
        { date: 'Saturday 3rd', description: 'Cooked dinner' },
      ],
      ['July 2025']: [
        { date: 'Monday 1st', description: 'Made tea' },
        { date: 'Tuesday 2nd', description: 'Went for a walk' },
        { date: 'Wednesday 3rd', description: 'Read a book' },
      ],
     
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const CHARACTER_LIMIT = 50;

    // ------------ UTILITY FUNCTIONS -------------------

    const getOrdinal = (n: number) => {
      const s = ["th", "st", "nd", "rd"],
        v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    const getTodayDateString = () => {
        const today = new Date();
        const weekday = today.toLocaleDateString('en-US', { weekday: 'long' });
        const day = today.getDate();
        return `${weekday} ${getOrdinal(day)}`;
    };

    /// returns in the format "July 2025" (to be displayed in the header)
    /// this is also the key for the entriesByMonth object
    const getCurrentMonthYear = () => {
        const today = new Date();
        const month = months[today.getMonth()];
        return `${month} ${today.getFullYear()}`;
    }

    const isCurrentMonth = () => {
        return selectedMonth === getCurrentMonthYear();
    }

    const getAvailableMonths = () => {
        const currentYear = new Date().getFullYear();
        const availableMonths = [];
        
        // Add current year months
        for (let i = 0; i < 12; i++) {
            availableMonths.push(`${months[i]} ${currentYear}`);
        }
        
        // // Add next year months
        // for (let i = 0; i < 12; i++) {
        //     availableMonths.push(`${months[i]} ${currentYear + 1}`);
        // }
        
        return availableMonths;
    };

    const hasEntryForToday = () => {
        const todayDateString = getTodayDateString();
        return entries.some(entry => entry.date === todayDateString);
    };


    // ------------ STATE MANAGEMENT ------------
    // state holding the currently selected month
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthYear());
    // state to hold all entries organised by month
    const [allEntriesByMonth, setAllEntriesByMonth] = useState(entriesByMonth);
    // are we showing the month dropdown?
    const [showMonthDropdown, setShowMonthDropdown] = useState(false);
    // are we adding today's entry? 
    const [adding, setAdding]  = useState(false);
    // are we editing / inputting an entry?
    const [input, setInput] = useState('');
    // index of the entry being edited, or null if not editing
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    // INITIALISE current month's entries
    const entries = allEntriesByMonth[selectedMonth] || [];
    

    
    // ------ HANDLERS ------------------------------------

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

        setAllEntriesByMonth(prevEntries => ({
            ...prevEntries,
            [selectedMonth]: [...(prevEntries[selectedMonth] || []), newEntry],
        }));

        setAdding(false);
        setInput('');
    }

    const handleEditEntry = (index: number) => {
        if (entries[index]) {
            setEditingIndex(index);
            setInput(entries[index].description);
        }
    }

    const handleSaveEdit = () => {
        if (input.trim() === '' || editingIndex === null) {
            return;
        }

        setAllEntriesByMonth(prevEntries => {
            const currentEntries = prevEntries[selectedMonth] || [];
            if (editingIndex >= 0 && editingIndex < currentEntries.length) {
                return {
                    ...prevEntries,
                    [selectedMonth]: currentEntries.map((entry, idx) => 
                        idx === editingIndex ? { ...entry, description: input } : entry
                    ),
                };
            }
            return prevEntries;
        });

        setEditingIndex(null);
        setInput('');
    }

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setInput('');
    }

    
    const handleMonthSelect = (month: string) => {
        setSelectedMonth(month);
        setShowMonthDropdown(false);
        setAdding(false);
        setEditingIndex(null);
        setInput('');
    }


    return (
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            {            /* should show month dropdown when pressed */}
            <TouchableOpacity onPress={() => setShowMonthDropdown(true)}>
              <Text style={styles.header}>{selectedMonth}</Text>
            </TouchableOpacity>
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
            {/* add entry button should only appear when we are not adding an entry and there's no entry for today and not editing and it's the current month*/}
            {!adding && !hasEntryForToday() && editingIndex === null && isCurrentMonth() && (
                <TouchableOpacity style={styles.addButton} onPress={() => setAdding(true)}>
                    <Text style={styles.addButtonText}>Add Entry</Text>
                </TouchableOpacity>
            )}
            {/* Show message when entry already exists for today and in current month */}
            {!adding && hasEntryForToday() && editingIndex === null && isCurrentMonth() && (
                <View style={styles.todayCompleteContainer}>
                    <Text style={styles.todayCompleteText}>You've already added an entry for today!</Text>
                </View>
            )}
            {/* if we are adding an entry or editing an entry, show the input modal */}
            <Modal
                visible={adding || editingIndex !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => {
                    if (adding) {
                        setAdding(false);
                        setInput('');
                    } else {
                        handleCancelEdit();
                    }
                }}
            >
                <View style={styles.inputModalOverlay}>
                    <TouchableOpacity 
                        style={styles.inputModalBackdrop}
                        activeOpacity={1}
                        onPress={() => {
                            if (adding) {
                                setAdding(false);
                                setInput('');
                            } else {
                                handleCancelEdit();
                            }
                        }}
                    />
                    <KeyboardAvoidingView 
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={styles.inputModalKeyboardView}
                    >
                        <View style={styles.inputModalContainer}>
                            <View style={styles.labelRow}>
                                <Text style={styles.inputLabel}>
                                    {adding ? "Today's Entry" : `Edit ${entries[editingIndex!]?.date || 'Entry'}`}
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
                            {/* BUTTONS at bottom of input box with conditional rendering */}
                            <View style={styles.buttonRow}>
                                <TouchableOpacity 
                                    style={styles.submitButton} 
                                    onPress={adding ? handleAddEntry : handleSaveEdit}
                                >
                                    <Text style={styles.submitButtonText}>
                                        {adding ? "Submit" : "Save"}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.cancelButton} 
                                    onPress={() => {
                                        if (adding) {
                                            setAdding(false);
                                            setInput('');
                                        } else {
                                            handleCancelEdit();
                                        }
                                    }}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
               {/* Month Selection Modal */}
            <Modal
                visible={showMonthDropdown}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowMonthDropdown(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowMonthDropdown(false)}
                >
                    <View style={styles.dropdownContainer}>
                        <Text style={styles.dropdownTitle}>Select Month</Text>
                        <FlatList
                            data={getAvailableMonths()}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.monthOption,
                                        item === selectedMonth && styles.selectedMonthOption
                                    ]}
                                    onPress={() => handleMonthSelect(item)}
                                >
                                    <Text style={[
                                        styles.monthOptionText,
                                        item === selectedMonth && styles.selectedMonthOptionText
                                    ]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
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
   modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '70%',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  monthOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedMonthOption: {
    backgroundColor: '#e8f5e8',
  },
  monthOptionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedMonthOptionText: {
    color: '#4a7c59',
    fontWeight: '600',
  },
  inputModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  inputModalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  inputModalKeyboardView: {
    justifyContent: 'flex-end',
  },
  inputModalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

