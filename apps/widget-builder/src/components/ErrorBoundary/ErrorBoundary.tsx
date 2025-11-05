import { ComponentType, PropsWithChildren, PureComponent } from 'react';

import { DefaultErrorDisplay, ErrorDisplayProps } from './ErrorDisplay';

export class ErrorBoundary extends PureComponent<
  PropsWithChildren & {
    errorDisplay?: false | ComponentType<ErrorDisplayProps>;
  }
> {
  state = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ hasError: true, error, errorInfo });
  }

  onReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.errorDisplay === false) {
        return null;
      }
      if (this.props.errorDisplay) {
        const ErrorDisplay = this.props.errorDisplay;
        return (
          <ErrorDisplay error={this.state.error} errorInfo={this.state.errorInfo} onReload={this.onReload} />
        );
      }
      return <DefaultErrorDisplay error={this.state.error} errorInfo={this.state.errorInfo} />;
    }

    return this.props.children;
  }
}
