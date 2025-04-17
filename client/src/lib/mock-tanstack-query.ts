/**
 * Mock implementation of TanStack Query
 * 
 * This file provides mock implementations of the TanStack Query hooks
 * for development purposes. In a real application, you would use the
 * actual @tanstack/react-query library.
 */

import { useState, useEffect } from 'react';

/**
 * QueryKey type
 */
export type QueryKey = unknown[];

/**
 * QueryFunction type
 */
export type QueryFunction<TData> = () => Promise<TData>;

/**
 * QueryOptions interface
 */
export interface QueryOptions<TData, TError> {
  queryKey: QueryKey;
  queryFn: QueryFunction<TData>;
  enabled?: boolean;
}

/**
 * UseQueryResult interface
 */
export interface UseQueryResult<TData, TError> {
  data: TData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: TError | null;
  refetch: () => Promise<TData>;
}

/**
 * useQuery hook
 * 
 * A mock implementation of the useQuery hook from TanStack Query.
 */
export function useQuery<TData = unknown, TError = Error>(
  options: QueryOptions<TData, TError>
): UseQueryResult<TData, TError> {
  const [data, setData] = useState<TData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<TError | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const result = await options.queryFn();
      setData(result);
      return result;
    } catch (err) {
      setIsError(true);
      setError(err as TError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (options.enabled !== false) {
      fetchData();
    }
  }, [options.queryKey.join(',')]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchData
  };
}

/**
 * MutationFunction type
 */
export type MutationFunction<TData, TVariables> = (variables: TVariables) => Promise<TData>;

/**
 * MutationOptions interface
 */
export interface MutationOptions<TData, TError, TVariables> {
  mutationFn: MutationFunction<TData, TVariables>;
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

/**
 * UseMutationResult interface
 */
export interface UseMutationResult<TData, TError, TVariables> {
  mutate: (variables: TVariables) => void;
  isPending: boolean;
  isError: boolean;
  error: TError | null;
  data: TData | undefined;
}

/**
 * useMutation hook
 * 
 * A mock implementation of the useMutation hook from TanStack Query.
 */
export function useMutation<TData = unknown, TError = Error, TVariables = void>(
  options: MutationOptions<TData, TError, TVariables>
): UseMutationResult<TData, TError, TVariables> {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<TError | null>(null);
  const [data, setData] = useState<TData | undefined>(undefined);

  const mutate = async (variables: TVariables) => {
    setIsPending(true);
    setIsError(false);
    setError(null);

    try {
      const result = await options.mutationFn(variables);
      setData(result);
      if (options.onSuccess) {
        options.onSuccess(result);
      }
    } catch (err) {
      setIsError(true);
      setError(err as TError);
      if (options.onError) {
        options.onError(err as TError);
      }
    } finally {
      setIsPending(false);
    }
  };

  return {
    mutate,
    isPending,
    isError,
    error,
    data
  };
}

/**
 * QueryClient class
 * 
 * A mock implementation of the QueryClient class from TanStack Query.
 */
export class QueryClient {
  invalidateQueries({ queryKey }: { queryKey: QueryKey }) {
    // In a real implementation, this would invalidate the query cache
    console.log('Invalidating queries with key:', queryKey);
  }
}

/**
 * useQueryClient hook
 * 
 * A mock implementation of the useQueryClient hook from TanStack Query.
 */
export function useQueryClient(): QueryClient {
  return new QueryClient();
}