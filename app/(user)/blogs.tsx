
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
} from 'react-native';

import Screen from '../../src/components/Screen';
import Header from '../../src/components/Header';
import BlogCard from '../../src/components/BlogCard';
import Loading from '../../src/components/Loading';
import { supabase } from '../../src/lib/supabase';

export default function BlogsScreen() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBlogs = async () => {
    try {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;

      console.log('Blogs Data:', data);
      console.log(
        'First Blog Image URL:',
        data?.[0]?.featured_image_url
      );

      setBlogs(data || []);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBlogs();
  };

  if (loading) return <Loading />;

  return (
    <Screen>
      <Header title="Health Articles" back />

      <FlatList
        data={blogs}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No articles available.
          </Text>
        }
        renderItem={({ item }) => (
          <BlogCard
            title={item.title || 'Health Tip'}
            image={
              item.featured_image_url ||
              item.image_url ||
              item.image ||
              'https://placehold.co/300x150?text=Blog'
            }
            mins={item.read_time || item.mins || '3 min'}
            category={item.target_audience || item.category || 'Health'}
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    paddingBottom: 90,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#9ca3af',
  },
});
