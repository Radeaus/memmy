import React, { useMemo, useState } from "react";
import { ScrollView, Text, useTheme } from "native-base";
import { CommunityView } from "lemmy-js-client";
import { RefreshControl } from "react-native";
import useTraverse from "../../hooks/traverse/useTraverse";
import LoadingView from "../../ui/Loading/LoadingView";
import TraverseItem from "../../ui/traverse/TraverseItem";
import SearchBar from "../../ui/search/SearchBar";

function TraverseScreen() {
  const theme = useTheme();
  const traverse = useTraverse();

  const [term, setTerm] = useState("");

  const header = useMemo(
    () => (
      <SearchBar
        searchValue={term}
        onSearchChange={setTerm}
        autoFocus={false}
      />
    ),
    [term]
  );

  const item = (community: CommunityView) => {
    if (term && !community.community.name.includes(term)) return null;

    return <TraverseItem community={community} key={community.community.id} />;
  };

  return useMemo(() => {
    if (traverse.loading) {
      return <LoadingView />;
    }

    return (
      <ScrollView
        flex={1}
        backgroundColor={theme.colors.app.bg}
        refreshControl={
          <RefreshControl
            refreshing={traverse.refreshing}
            onRefresh={() => traverse.doLoad(true)}
          />
        }
      >
        {header}
        {traverse.subscriptions.length === 0 ? (
          <Text
            fontStyle="italic"
            textAlign="center"
            justifyContent="center"
            alignSelf="center"
          >
            You don&apos;t have any subscriptions.
          </Text>
        ) : (
          traverse.subscriptions.map((c) => item(c))
        )}
      </ScrollView>
    );
  }, [
    traverse.subscriptions,
    traverse.loading,
    traverse.error,
    traverse.refreshing,
    term,
  ]);
}

export default TraverseScreen;
