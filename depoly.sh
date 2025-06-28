#!/bin/bash

# Deploy script for esotericstrade-frontend
# This script copies the built frontend files to different environments

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Build directory
BUILD_DIR="$HOME/esotericstrade-frontend/dist"

# Remote directory where files will be copied
REMOTE_DIR="/var/www/esoterictrade-ui"

# Function to display usage
usage() {
    echo "Usage: $0 {dev|stage|prod} [remote-path]"
    echo "  dev   - Deploy to development server (esoterictrade.net)"
    echo "  stage - Deploy to staging server (esoterictrade.org)"
    echo "  prod  - Deploy to production server (esoterictrade.in)"
    echo "  remote-path - Optional: specify custom remote directory (default: $REMOTE_DIR)"
    exit 1
}

# Function to perform deployment
deploy() {
    local env=$1
    local host=$2
    local domain=$3
    local remote_path=${4:-$REMOTE_DIR}
    
    echo -e "${YELLOW}Starting deployment to $env environment ($domain)...${NC}"
    
    # Check if build directory exists
    if [ ! -d "$BUILD_DIR" ]; then
        echo -e "${RED}Error: Build directory not found at $BUILD_DIR${NC}"
        echo "Please run your build command first."
        exit 1
    fi
    
    # Check if build directory has files
    if [ -z "$(ls -A $BUILD_DIR)" ]; then
        echo -e "${RED}Error: Build directory is empty${NC}"
        echo "Please run your build command first."
        exit 1
    fi
    
    echo -e "${GREEN}Copying files from $BUILD_DIR to $host:$remote_path${NC}"
    
    # Create a temporary directory on the remote server
    TEMP_DIR="/tmp/esoteric-deploy-$(date +%s)"
    ssh $host "mkdir -p $TEMP_DIR" || {
        echo -e "${RED}Error: Could not create temporary directory${NC}"
        exit 1
    }
    
    # Copy files to temporary directory first
    echo -e "${GREEN}Copying files to temporary directory...${NC}"
    scp -r $BUILD_DIR/* $host:$TEMP_DIR/ || {
        echo -e "${RED}Error: Failed to copy files${NC}"
        ssh $host "rm -rf $TEMP_DIR"
        exit 1
    }
    
    # Clear the destination directory and move files from temp to final location
    echo -e "${GREEN}Moving files to final destination...${NC}"
    ssh $host "
        sudo rm -rf $remote_path/* && \
        sudo cp -r $TEMP_DIR/* $remote_path/ && \
        sudo chown -R www-data:www-data $remote_path && \
        sudo chmod -R 755 $remote_path && \
        rm -rf $TEMP_DIR
    " || {
        echo -e "${RED}Error: Failed to move files to final destination${NC}"
        ssh $host "rm -rf $TEMP_DIR"
        exit 1
    }
    
    echo -e "${GREEN}✓ Deployment to $env completed successfully!${NC}"
    echo -e "${GREEN}  URL: $domain${NC}"
}

# Main script logic
if [ $# -lt 1 ]; then
    usage
fi

ENV=$1
CUSTOM_REMOTE_PATH=$2

case $ENV in
    dev)
        deploy "DEVELOPMENT" "dev_t3a" "https://esoterictrade.net" "$CUSTOM_REMOTE_PATH"
        ;;
    stage)
        deploy "STAGING" "stage_t3a" "https://esoterictrade.org" "$CUSTOM_REMOTE_PATH"
        ;;
    prod)
        echo -e "${YELLOW}⚠️  WARNING: You are about to deploy to PRODUCTION!${NC}"
        echo -e "${YELLOW}   This will affect: https://esoterictrade.in${NC}"
        read -p "Are you sure you want to continue? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            deploy "PRODUCTION" "prod_t3a" "https://esoterictrade.in" "$CUSTOM_REMOTE_PATH"
        else
            echo -e "${RED}Production deployment cancelled.${NC}"
            exit 0
        fi
        ;;
    *)
        echo -e "${RED}Error: Invalid environment specified${NC}"
        usage
        ;;
esac

# Optional: Clear any CDN cache if you're using one
# echo -e "${YELLOW}Note: Remember to clear CDN cache if applicable${NC}"
