import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { toggleFavourite } from '../../redux/slices/favouritesSlice';
import { storageService } from '../../utils/storage';
import { showAlert } from '../../utils/alert';
import { TransportCard } from '../../components/common';
import { MainTabParamList, HomeStackParamList, TransportItem } from '../../types';

type FavouritesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Favourites'>,
  NativeStackNavigationProp<HomeStackParamList>
>;

interface FavouritesScreenProps {
  navigation: FavouritesScreenNavigationProp;
}

const FavouritesScreen: React.FC<FavouritesScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const { items } = useAppSelector((state) => state.transport);
  const { favouriteIds } = useAppSelector((state) => state.favourites);

  const favouriteItems = items.filter((item) => favouriteIds.includes(item.id));

  const handleItemPress = (item: TransportItem) => {
    // Navigate to home stack's Details screen
    navigation.navigate('Home' as any, {
      screen: 'Details',
      params: { item },
    });
  };

  const handleFavouritePress = async (itemId: number) => {
    dispatch(toggleFavourite(itemId));
    
    // Update storage
    const currentFavourites = favouriteIds.filter(id => id !== itemId);
    await storageService.saveFavourites(currentFavourites);
    
    // Show feedback
    const item = items.find(i => i.id === itemId);
    showAlert('Removed from Favourites', `${item?.title} has been removed from favourites.`);
  };

  const renderItem = ({ item }: { item: TransportItem }) => (
    <TransportCard
      item={item}
      onPress={() => handleItemPress(item)}
      onFavouritePress={() => handleFavouritePress(item.id)}
      isFavourite={true}
    />
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Feather
        name="heart"
        size={64}
        color={isDarkMode ? '#ABABAB' : '#CCCCCC'}
      />
      <Text style={[styles.emptyText, isDarkMode && styles.emptyTextDark]}>
        No favourites yet
      </Text>
      <Text style={[styles.emptySubtext, isDarkMode && styles.emptySubtextDark]}>
        Start adding items to your favourites
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDarkMode && styles.titleDark]}>
          My Favourites
        </Text>
        <Text style={[styles.subtitle, isDarkMode && styles.subtitleDark]}>
          {favouriteItems.length} {favouriteItems.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      <FlatList
        data={favouriteItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={favouriteItems.length === 0 && styles.emptyListContainer}
        showsVerticalScrollIndicator={false}
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
  header: {
    padding: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  subtitleDark: {
    color: '#ABABAB',
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
    fontSize: 20,
    fontWeight: '600',
    color: '#999999',
    marginTop: 16,
  },
  emptyTextDark: {
    color: '#666666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 8,
  },
  emptySubtextDark: {
    color: '#555555',
  },
});

export default FavouritesScreen;
