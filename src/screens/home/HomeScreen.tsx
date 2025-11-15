import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchTransportStart,
  fetchTransportSuccess,
  fetchTransportFailure,
} from '../../redux/slices/transportSlice';
import { toggleFavourite, setFavourites } from '../../redux/slices/favouritesSlice';
import { transportService } from '../../services/transportService';
import { storageService } from '../../utils/storage';
import { showAlert } from '../../utils/alert';
import { TransportCard, Loading } from '../../components/common';
import { HomeStackParamList, TransportItem } from '../../types';

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeScreen'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const { items, isLoading } = useAppSelector((state) => state.transport);
  const { favouriteIds } = useAppSelector((state) => state.favourites);
  const { user } = useAppSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'destinations' | 'routes'>('all');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load favourites from storage
      const savedFavourites = await storageService.getFavourites();
      dispatch(setFavourites(savedFavourites));

      // Fetch transport items
      dispatch(fetchTransportStart());
      const data = await transportService.fetchTransportItems();
      dispatch(fetchTransportSuccess(data));
    } catch (error: any) {
      dispatch(fetchTransportFailure(error.message));
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      dispatch(fetchTransportStart());
      const data = await transportService.fetchTransportItems();
      dispatch(fetchTransportSuccess(data));
    } catch (error: any) {
      dispatch(fetchTransportFailure(error.message));
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      handleRefresh();
      return;
    }

    try {
      dispatch(fetchTransportStart());
      const data = await transportService.searchTransport(query);
      dispatch(fetchTransportSuccess(data));
    } catch (error: any) {
      dispatch(fetchTransportFailure(error.message));
    }
  };

  const handleFavouritePress = async (itemId: number) => {
    const wasAdded = !favouriteIds.includes(itemId);
    dispatch(toggleFavourite(itemId));
    
    // Update storage
    const currentFavourites = favouriteIds.includes(itemId)
      ? favouriteIds.filter(id => id !== itemId)
      : [...favouriteIds, itemId];
    await storageService.saveFavourites(currentFavourites);
    
    // Show feedback
    if (wasAdded) {
      const item = items.find(i => i.id === itemId);
      showAlert('Added to Favourites', `${item?.title} has been added to your favourites.`);
    }
  };

  const handleItemPress = (item: TransportItem) => {
    navigation.navigate('Details', { item });
  };

  const getFilteredSections = () => {
    let filteredItems = items;

    // Apply search filter
    if (searchQuery.trim() !== '') {
      filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.to?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Separate destinations and routes
    const destinations = filteredItems.filter(item => item.type === 'destination');
    const routes = filteredItems.filter(item => ['bus', 'train', 'car', 'tuk_tuk'].includes(item.type));

    // Apply active filter
    if (activeFilter === 'destinations') {
      return destinations.length > 0 ? [{ title: 'Destinations', data: destinations }] : [];
    } else if (activeFilter === 'routes') {
      return routes.length > 0 ? [{ title: 'Transport Routes', data: routes }] : [];
    }

    // Show all with sections
    const sections = [];
    if (destinations.length > 0) {
      sections.push({ title: 'Popular Destinations', data: destinations });
    }
    if (routes.length > 0) {
      sections.push({ title: 'Transport Routes', data: routes });
    }
    return sections;
  };

  const renderStickyHeader = () => (
    <View style={[styles.stickyHeaderContainer, isDarkMode && styles.stickyHeaderContainerDark]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, isDarkMode && styles.greetingDark]}>
          {getGreeting()} 👋
        </Text>
        <Text style={[styles.userName, isDarkMode && styles.userNameDark]}>
          {user?.firstName || 'Traveler'}
        </Text>
        <Text style={[styles.subtitle, isDarkMode && styles.subtitleDark]}>
          Where would you like to explore today?
        </Text>
      </View>
      {renderSearchBar()}
      {renderFilterTabs()}
    </View>
  );

  const renderFilterTabs = () => (
    <View style={[styles.filterContainer, isDarkMode && styles.filterContainerDark]}>
      <TouchableOpacity
        style={[
          styles.filterTab,
          activeFilter === 'all' && styles.filterTabActive,
        ]}
        onPress={() => setActiveFilter('all')}
      >
        <Text
          style={[
            styles.filterTabText,
            isDarkMode && styles.filterTabTextDark,
            activeFilter === 'all' && styles.filterTabTextActive,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterTab,
          activeFilter === 'destinations' && styles.filterTabActive,
        ]}
        onPress={() => setActiveFilter('destinations')}
      >
        <Text
          style={[
            styles.filterTabText,
            isDarkMode && styles.filterTabTextDark,
            activeFilter === 'destinations' && styles.filterTabTextActive,
          ]}
        >
          Destinations
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterTab,
          activeFilter === 'routes' && styles.filterTabActive,
        ]}
        onPress={() => setActiveFilter('routes')}
      >
        <Text
          style={[
            styles.filterTabText,
            isDarkMode && styles.filterTabTextDark,
            activeFilter === 'routes' && styles.filterTabTextActive,
          ]}
        >
          Routes
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSearchBar = () => (
    <View style={[styles.searchContainer, isDarkMode && styles.searchContainerDark]}>
      <Feather
        name="search"
        size={20}
        color={isDarkMode ? '#ABABAB' : '#666666'}
        style={styles.searchIcon}
      />
      <TextInput
        style={[styles.searchInput, isDarkMode && styles.searchInputDark]}
        placeholder="Search destinations, routes..."
        placeholderTextColor={isDarkMode ? '#ABABAB' : '#999999'}
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {searchQuery !== '' && (
        <TouchableOpacity onPress={() => handleSearch('')}>
          <Feather name="x" size={20} color={isDarkMode ? '#ABABAB' : '#666666'} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderItem = ({ item }: { item: TransportItem }) => (
    <TransportCard
      item={item}
      onPress={() => handleItemPress(item)}
      onFavouritePress={() => handleFavouritePress(item.id)}
      isFavourite={favouriteIds.includes(item.id)}
    />
  );

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={[styles.sectionHeaderContainer, isDarkMode && styles.sectionHeaderContainerDark]}>
      <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>
        {section.title}
      </Text>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Feather name="inbox" size={64} color={isDarkMode ? '#ABABAB' : '#CCCCCC'} />
      <Text style={[styles.emptyText, isDarkMode && styles.emptyTextDark]}>
        {searchQuery ? 'No results found' : 'No items available'}
      </Text>
    </View>
  );

  const sections = getFilteredSections();

  if (isLoading && items.length === 0) {
    return <Loading />;
  }

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      {renderStickyHeader()}
      <SectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={isDarkMode ? '#0A84FF' : '#007AFF'}
          />
        }
        contentContainerStyle={sections.length === 0 ? styles.emptyListContainer : styles.contentContainer}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  stickyHeaderContainer: {
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  stickyHeaderContainerDark: {
    backgroundColor: '#000000',
    borderBottomColor: '#2C2C2E',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 40,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 4,
  },
  greetingDark: {
    color: '#ABABAB',
  },
  userName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  userNameDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
    lineHeight: 20,
  },
  subtitleDark: {
    color: '#ABABAB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
  },
  searchInputDark: {
    color: '#FFFFFF',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  filterContainerDark: {
    // No additional styles
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterTabActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  filterTabTextDark: {
    color: '#ABABAB',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sectionHeaderContainer: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionHeaderContainerDark: {
    backgroundColor: '#000000',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  contentContainer: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
    marginTop: 16,
  },
  emptyTextDark: {
    color: '#666666',
  },
});

export default HomeScreen;
